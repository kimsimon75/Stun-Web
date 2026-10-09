import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateStunDeviation, estimateCycleDeviation, unitStunDeviation } from '../units/stun-deviation.js';

const chance = (p, dur) => ({ type: 'chance', p, dur });

// Independently enumerate every possible attack outcome and union its covered
// time segments. This checks overlap and a window ending between attacks.
function enumerateCoverage(interval, effects, window) {
    const first = 1 - Math.ceil(Math.max(...effects.map(effect => effect.dur)) / interval);
    const last = Math.ceil(window / interval) - 1;
    let mean = 0, second = 0;
    function visit(attack, probability, spans) {
        if (attack > last) {
            const sorted = spans.map(([a, b]) => [Math.max(0, a), Math.min(window, b)])
                .filter(([a, b]) => a < b).sort((a, b) => a[0] - b[0]);
            let covered = 0, end = 0;
            for (const [a, b] of sorted) {
                covered += Math.max(0, b - Math.max(a, end));
                end = Math.max(end, b);
            }
            const uptime = covered / window;
            mean += probability * uptime;
            second += probability * uptime ** 2;
            return;
        }
        for (let outcome = 0; outcome < 2 ** effects.length; outcome++) {
            let weight = probability, duration = 0;
            effects.forEach((effect, index) => {
                const success = outcome & (1 << index);
                weight *= success ? effect.p : 1 - effect.p;
                if (success) duration = Math.max(duration, effect.dur);
            });
            visit(attack + 1, weight, duration > 0 ? [...spans, [attack * interval, attack * interval + duration]] : spans);
        }
    }
    visit(first, 1, []);
    return { meanPercent: mean * 100, deviationPercent: Math.sqrt(Math.max(0, second - mean ** 2)) * 100 };
}

test('non-overlapping stuns reproduce binomial uptime variance', () => {
    const result = estimateStunDeviation(0.5, [chance(0.25, 0.5)]);
    assert.equal(result.meanPercent, 25);
    assert(Math.abs(result.deviationPercent - 100 * Math.sqrt(0.25 * 0.75 / 20)) < 1e-10);
    assert.equal(estimateStunDeviation(0.5, [chance(1, 0.5)]).deviationPercent, 0);
    assert.equal(estimateStunDeviation(0.5, [chance(0, 0.5)]).deviationPercent, 0);
});

test('overlap, dual procs and partial attack intervals match exhaustive outcomes', () => {
    for (const [interval, effects, window] of [
        [0.4, [chance(0.3, 0.9)], 1.7],
        [1, [chance(0.3, 1.5), chance(0.2, 0.7)], 2.5],
        [1, [chance(0.3, 1.5)], 0.3],
    ]) {
        const actual = estimateStunDeviation(interval, effects, window);
        const expected = enumerateCoverage(interval, effects, window);
        assert(Math.abs(actual.meanPercent - expected.meanPercent) < 1e-9);
        assert(Math.abs(actual.deviationPercent - expected.deviationPercent) < 1e-9);
    }
});

test('fixed cooldowns have no proc randomness and mana-only effects need a separate model', () => {
    assert.equal(unitStunDeviation({ stun1: { type: 'cooldown', cd: 5, dur: 3.5 } }).deviationPercent, 0);
    assert.equal(unitStunDeviation({ stun1: { type: 'none' }, stun2: { type: 'none' } }), null);
});

test('cycle deviation matches direct phase integration of a fixed repeating stun', () => {
    const cycles = [{ probability: 1, time: 3.7, stunnedTime: 2.25 }];
    const mean = 2.25 / 3.7;
    let variance = 0;
    const phases = 8192;
    for (let index = 0; index < phases; index++) {
        const phase = 3.7 * (index + 0.5) / phases;
        let covered = 0;
        for (let event = -phase; event < 10; event += 3.7) {
            covered += Math.max(0, Math.min(10, event + 2.25) - Math.max(0, event));
        }
        variance += (covered / 10 - mean) ** 2 / phases;
    }
    const actual = estimateCycleDeviation(cycles);
    assert.equal(actual.meanPercent, mean * 100);
    assert(Math.abs(actual.deviationPercent - 100 * Math.sqrt(variance)) < 0.15);
    assert.equal(estimateCycleDeviation([{ probability: 1, time: 3, stunnedTime: 3 }]).deviationPercent, 0);
    assert.equal(estimateCycleDeviation([{ probability: 1, time: 3, stunnedTime: 0 }]).deviationPercent, 0);
    assert.equal(estimateCycleDeviation([{ probability: 1, time: 0, stunnedTime: 0 }]), null);
});

test('capped cycle windows use a time-weighted starting phase and stable sampling', () => {
    const cycles = Array.from({ length: 7 }, (_, hit) => ({
        probability: 0.73 ** hit * (hit === 6 ? 1 : 0.27),
        time: 0.65 + 0.39 * 0.5 / 1.33 + hit * 0.5,
        stunnedTime: Math.min(2.25, 0.65 + 0.39 * 0.5 / 1.33 + hit * 0.5),
    }));
    // This short window can cross at most one event. Integrate every initial
    // cycle and phase directly, using no production RNG or simulation loop.
    const window = 0.2;
    const expectedTime = cycles.reduce((sum, cycle) => sum + cycle.probability * cycle.time, 0);
    const mean = cycles.reduce((sum, cycle) => sum + cycle.probability * cycle.stunnedTime, 0) / expectedTime;
    let variance = 0;
    const phases = 8192;
    for (const cycle of cycles) for (let index = 0; index < phases; index++) {
        const phase = cycle.time * (index + 0.5) / phases;
        const initialStun = Math.max(0, Math.min(cycle.stunnedTime, phase + window) - phase);
        const afterEvent = Math.max(0, phase + window - cycle.time);
        variance += ((initialStun + afterEvent) / window - mean) ** 2
            * cycle.probability * cycle.time / expectedTime / phases;
    }
    const estimate = estimateCycleDeviation(cycles, window);
    assert(Math.abs(estimate.deviationPercent - 100 * Math.sqrt(variance)) < 0.2);
    assert.deepEqual(estimateCycleDeviation(cycles), estimateCycleDeviation(cycles));
    assert.deepEqual(unitStunDeviation({ name: '라분', StunCycles: cycles }), estimateCycleDeviation(cycles));
});

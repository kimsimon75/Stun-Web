import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateStunDeviation, estimateLaboonDeviation, unitStunDeviation } from '../units/stun-deviation.js';
import { laboonStunCycles, laboonStunUptime } from '../units/laboon-stun.js';

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

const laboon = (p = 0.27, duration = 2.25) => ({
    name: '라분', attackCycle: 1.33, StunAttackInterval: 0.5,
    stun1: chance(p, duration), stun2: { type: 'none' },
});

test('Laboon probabilities stop at the seventh hit and match the existing uptime formula', () => {
    const unit = laboon();
    const cycles = laboonStunCycles(unit);
    assert.equal(cycles.length, 7);
    assert(Math.abs(cycles.reduce((sum, cycle) => sum + cycle.probability, 0) - 1) < 1e-12);
    assert.equal(cycles[0].probability, 0.27);
    assert.equal(cycles[6].probability, 0.73 ** 6);
    assert.equal(cycles[0].period, 0.65 + 0.39 * 0.5 / 1.33);
    assert.equal(cycles[6].period, cycles[0].period + 6 * 0.5);
    // Independently enumerate first success for hits 1..6; otherwise force hit 7.
    let expectedTime = 0, expectedStun = 0;
    for (let hits = 1; hits <= 7; hits++) {
        const probability = hits < 7 ? 0.27 * 0.73 ** (hits - 1) : 0.73 ** 6;
        const time = 0.65 + 0.39 / (1.33 / 0.5) + (hits - 1) * 0.5;
        expectedTime += probability * time;
        expectedStun += probability * Math.min(2.25, time);
    }
    assert(Math.abs(laboonStunUptime(unit) - expectedStun / expectedTime) < 1e-12);
    assert.equal(laboonStunCycles(laboon(0))[6].probability, 1);
    assert.equal(laboonStunCycles(laboon(1))[0].probability, 1);
});

test('Laboon finite-window deviation respects the guaranteed hit, random phase and full coverage', () => {
    const unit = laboon(0);
    const period = laboonStunCycles(unit)[6].period;
    // No ordinary procs: every cycle is exactly seven hits. Integrate a random
    // phase directly, without the production simulation or its random generator.
    const window = 10;
    const mean = laboonStunUptime(unit);
    let variance = 0;
    const phases = 8192;
    for (let index = 0; index < phases; index++) {
        const phase = period * (index + 0.5) / phases;
        let covered = 0;
        for (let event = -phase; event < window; event += period) {
            covered += Math.max(0, Math.min(window, event + 2.25) - Math.max(0, event));
        }
        variance += (covered / window - mean) ** 2 / phases;
    }
    const estimate = estimateLaboonDeviation(unit);
    assert(Math.abs(estimate.deviationPercent - 100 * Math.sqrt(variance)) < 0.15);
    assert.deepEqual(estimateLaboonDeviation(laboon()), estimateLaboonDeviation(laboon()));
    assert.equal(estimateLaboonDeviation(laboon(0.27, 10)).deviationPercent, 0);
    assert.equal(estimateLaboonDeviation(laboon(0.27, 10)).meanPercent, 100);
});

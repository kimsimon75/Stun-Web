import { laboonStunCycles, laboonStunUptime } from './laboon-stun.js';

export const STUN_DEVIATION_WINDOW = 10;

// Stationary attack model: attacks are independent, and a stun refreshes its
// remaining duration. Average coverage over a finite window is a random variable.
// Var(coverage) = integral integral Cov(stunned(t), stunned(s)) dt ds / window².
// We integrate exactly between attack/stun expiry boundaries, including a partial
// final attack interval. Shared attacks are counted once in the joint probability.
export function estimateStunDeviation(interval, effects, window = STUN_DEVIATION_WINDOW) {
    if (!Number.isFinite(interval) || interval <= 0 || !Number.isFinite(window) || window <= 0) return null;
    const stuns = effects.filter(effect => effect?.type === 'chance' && effect.p > 0 && effect.dur > 0);
    if (stuns.some(effect => !Number.isFinite(effect.p) || effect.p > 1 || !Number.isFinite(effect.dur))) return null;
    if (!stuns.length) return { meanPercent: 0, deviationPercent: 0 };

    const memory = Math.ceil(Math.max(...stuns.map(effect => effect.dur)) / interval);
    // Each phase has a fixed set of past attacks capable of covering it.
    const boundaries = [...new Set([0, interval, ...stuns.map(effect => {
        const phase = effect.dur % interval;
        return phase < 1e-10 || interval - phase < 1e-10 ? 0 : phase;
    })])].sort((a, b) => a - b);
    const phases = boundaries.slice(1).map((end, index) => {
        const start = boundaries[index];
        const midpoint = (start + end) / 2;
        const failures = Array.from({ length: memory }, (_, age) => stuns.reduce(
            (probability, effect) => probability * (effect.dur > age * interval + midpoint ? 1 - effect.p : 1), 1,
        ));
        return { start, end, failures, noStun: failures.reduce((product, value) => product * value, 1) };
    });
    const portions = length => phases.map(phase => ({
        ...phase, weight: Math.max(0, Math.min(length, phase.end) - phase.start),
    })).filter(phase => phase.weight > 0);
    const full = portions(interval);
    const covariance = (left, right, lag) => {
        let result = 0;
        for (const a of left) for (const b of right) {
            let jointNoStun = 1;
            for (let attack = -(memory - 1); attack <= lag; attack++) {
                const ageA = -attack;
                const ageB = lag - attack;
                const failureA = a.failures[ageA] ?? 1;
                const failureB = b.failures[ageB] ?? 1;
                // Both observation points constrain the same attack. The longer
                // coverage requirement contains the shorter one, so use min.
                jointNoStun *= Math.min(failureA, failureB);
            }
            result += a.weight * b.weight * (jointNoStun - a.noStun * b.noStun);
        }
        return result;
    };
    const count = Math.floor(window / interval);
    const remainder = window - count * interval;
    const partial = portions(remainder);
    let variance = count * covariance(full, full, 0) + covariance(partial, partial, 0);
    for (let lag = 1; lag < Math.min(memory, count); lag++) {
        variance += 2 * (count - lag) * covariance(full, full, lag);
    }
    for (let lag = 1; lag <= Math.min(memory - 1, count); lag++) {
        variance += 2 * covariance(full, partial, lag);
    }
    const covered = parts => parts.reduce((sum, phase) => sum + phase.weight * (1 - phase.noStun), 0);
    return {
        meanPercent: 100 * (count * covered(full) + covered(partial)) / window,
        deviationPercent: 100 * Math.sqrt(Math.max(0, variance)) / window,
    };
}

export function estimateLaboonDeviation(unit, window = STUN_DEVIATION_WINDOW) {
    const cycles = laboonStunCycles(unit);
    if (!cycles || !Number.isFinite(window) || window <= 0) return null;
    const expectedPeriod = cycles.reduce((sum, cycle) => sum + cycle.probability * cycle.period, 0);
    const mean = laboonStunUptime(unit);
    if (cycles.every(cycle => cycle.probability === 0 || cycle.covered === cycle.period)) {
        return { meanPercent: 100, deviationPercent: 0, model: 'laboon' };
    }
    // Reproducible finite-window simulation, including the stationary starting
    // phase. Longer cycles occupy more time, so the first cycle is length-biased.
    // Every later cycle uses the actual capped geometric distribution above.
    let state = 0x19ab007;
    const random = () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 4294967296;
    };
    const sample = stationary => {
        let target = random();
        for (const cycle of cycles) {
            target -= cycle.probability * (stationary ? cycle.period / expectedPeriod : 1);
            if (target <= 0) return cycle;
        }
        return cycles[cycles.length - 1];
    };
    const samples = 16384;
    let squaredError = 0;
    for (let index = 0; index < samples; index++) {
        let cycle = sample(true);
        let phase = random() * cycle.period;
        let remaining = window;
        let covered = 0;
        while (remaining > 0) {
            const elapsed = Math.min(remaining, cycle.period - phase);
            covered += Math.max(0, Math.min(cycle.covered, phase + elapsed) - phase);
            remaining -= elapsed;
            if (remaining <= 0) break;
            cycle = sample(false);
            phase = 0;
        }
        squaredError += (covered / window - mean) ** 2;
    }
    return { meanPercent: mean * 100, deviationPercent: 100 * Math.sqrt(squaredError / samples), model: 'laboon' };
}

export function unitStunDeviation(unit) {
    if (unit.name === '라분') return estimateLaboonDeviation(unit);
    if (unit.stun1.type === 'cooldown') return { meanPercent: 100 * Math.min(1, unit.stun1.dur / unit.stun1.cd), deviationPercent: 0 };
    if (unit.stun1.type === 'none' && unit.stun2.type === 'none') return null;
    return estimateStunDeviation(unit.StunAttackInterval, [unit.stun1, unit.stun2]);
}

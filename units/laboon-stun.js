export const LABOON_RECOVERY = 0.65;
export const LABOON_MAX_ATTACKS = 7;
export const LABOON_ATTACK_DELAY = 0.39;

export function laboonStunCycles(unit) {
    const interval = unit.StunAttackInterval;
    const chance = unit.stun1.p;
    const duration = unit.stun1.dur;
    if (!(interval > 0) || !Number.isFinite(interval) || !(unit.attackCycle > 0)
        || !Number.isFinite(duration) || duration < 0 || !Number.isFinite(chance) || chance < 0 || chance > 1) return null;
    const firstAttackDelay = LABOON_ATTACK_DELAY * interval / unit.attackCycle;
    return Array.from({ length: LABOON_MAX_ATTACKS }, (_, index) => {
        // First six hits can proc; surviving all six guarantees the seventh.
        const probability = (1 - chance) ** index * (index === LABOON_MAX_ATTACKS - 1 ? 1 : chance);
        const period = LABOON_RECOVERY + firstAttackDelay + index * interval;
        return { probability, period, covered: Math.min(duration, period) };
    });
}

export function laboonStunUptime(unit) {
    const cycles = laboonStunCycles(unit);
    if (!cycles) return 0;
    const expectedPeriod = cycles.reduce((sum, cycle) => sum + cycle.probability * cycle.period, 0);
    const expectedCovered = cycles.reduce((sum, cycle) => sum + cycle.probability * cycle.covered, 0);
    return expectedCovered / expectedPeriod;
}

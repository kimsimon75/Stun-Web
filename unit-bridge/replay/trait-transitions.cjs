// 성공 후보는 명령 주체가 확인되고, 직후 새 변신 개체가 하나만 관측된 경우로 제한합니다.
const rules = {
    A04X: ['H09H', 'H09G'],
    A0WS: ['h04E', 'h0BM'],
    A1B0: ['h08O', 'h09Q'],
};
function findTraitTransitions({ observations, commands }) {
    const first = new Map(), consumed = new Set(), result = [];
    for (const o of observations) if (!first.has(o.objectTag)) first.set(o.objectTag, o);
    for (const c of commands) {
        const rule = rules[c.abilityId];
        if (!rule || consumed.has(c.sourceTag)) continue;
        const source = observations.filter(o => o.objectTag === c.sourceTag && o.timeMs <= c.timeMs).at(-1);
        if (!source || source.typeId !== rule[0] || source.commandPlayerId !== c.commandPlayerId) continue;
        const candidates = [...first.values()].filter(o => o.typeId === rule[1]
            && o.commandPlayerId === c.commandPlayerId && o.timeMs >= c.timeMs
            && o.timeMs - c.timeMs <= 15000 && !consumed.has(o.objectTag));
        if (candidates.length !== 1) continue;
        const target = candidates[0];
        // 이후 원본이 다시 관측되면 소멸/변신으로 볼 수 없습니다.
        if (observations.some(o => o.objectTag === c.sourceTag && o.timeMs > target.timeMs)) continue;
        consumed.add(c.sourceTag); consumed.add(target.objectTag);
        result.push({ fromInstanceId: c.sourceTag, toInstanceId: target.objectTag,
            fromTypeId: rule[0], toTypeId: rule[1], observerPlayerId: c.commandPlayerId,
            timeMs: target.timeMs, abilityId: c.abilityId });
    }
    return result;
}
module.exports = { findTraitTransitions, rules };

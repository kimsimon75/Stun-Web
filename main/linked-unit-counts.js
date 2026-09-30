const excludedRanks = new Set(['아이템', '항법', '연구소']);

export function linkedUnitIndex(units) {
    const index = new Map();
    for (const unit of units) {
        if (excludedRanks.has(unit.rank) || !unit.rawcode) continue;
        const previous = index.get(unit.rawcode);
        // 동일 코드의 특강/레벨별 계산 항목은 기본 항목 하나만 선택합니다.
        if (!previous || (/[（(]/.test(previous.name) && !/[（(]/.test(unit.name))
            || unit.name === '고죠 사토루') index.set(unit.rawcode, unit);
    }
    return index;
}

export function linkedRows(data, units, player = 'all') {
    const index = linkedUnitIndex(units);
    const replay = data?.kind === 'replay-observations';
    return (data?.units ?? []).filter(row => index.has(row.typeId)
        && Number.isSafeInteger(row.count) && row.count >= 0
        && (player === 'all' || String(replay ? row.observerPlayerId : row.playerId + 1) === String(player)));
}

export function applyLinkedCounts(data, player, units) {
    if (!data || player === 'all') return false;
    const index = linkedUnitIndex(units), counts = new Map();
    for (const row of linkedRows(data, units, player)) {
        const unit = index.get(row.typeId);
        counts.set(unit, (counts.get(unit) ?? 0) + row.count);
    }
    let changed = false;
    for (const unit of units) {
        if (excludedRanks.has(unit.rank) || !unit.rawcode) continue;
        const count = counts.get(unit) ?? 0;
        if (unit.Check !== count) { unit.Check = count; changed = true; }
    }
    return changed;
}

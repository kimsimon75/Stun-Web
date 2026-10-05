// 반복 폴링에도 한 전환은 한 번만 적용합니다. 기본 개체 하나만 차감합니다.
export function applyTraitCounts(data, player, units, applied) {
    if(data?.kind!=='replay-observations'||player==='all')return 0;
    let changed=0;
    for(const t of data.traitTransitions??[]){
        if(String(t.observerPlayerId)!==String(player))continue;
        const key=`${data.replayId}:${t.observerPlayerId}:${t.fromInstanceId}:${t.toInstanceId}`;
        if(applied.has(key))continue;
        const from=units.find(u=>u.rawcode===t.fromTypeId);
        const to=units.find(u=>u.rawcode===t.toTypeId);
        if(!from||!to||from===to)continue;
        from.Check=Math.max(0,(from.Check||0)-1);
        to.Check=(to.Check||0)+1;
        applied.add(key);changed++;
    }
    return changed;
}

// 같은 버프 그룹은 가장 높은 단계 하나만 합산합니다.
export function traitBuffTotals(units, groups) {
    const grouped=new Set(groups.flat().map(([name,rank])=>rank+'/'+name));
    const active=units.filter(u=>u.Check>0&&!grouped.has(u.rank+'/'+u.name));
    for(const group of groups){
        const top=group.map(([name,rank])=>units.find(u=>u.name===name&&u.rank===rank)).filter(u=>u?.Check>0).at(-1);
        if(top)active.push(top);
    }
    return Object.fromEntries(['atkSpeedBuff','manaRegen','healthRegen','slow'].map(k=>[k,active.reduce((n,u)=>n+(u[k]||0),0)]));
}

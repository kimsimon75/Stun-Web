import { Unit, Func } from "../import.js";
import { BuffAdd } from "./buff-state.js";
import { Collect } from "./buff-sync.js";
import { CountOn } from "./refresh.js";

export function CheckEvent(CheckEl, item, fallbackIndex) {

    CheckEl.addEventListener("change", (event) => {
        const checked = event.target.checked === true;

        const findAllUnitIndex = (name, rank) =>
            Unit.allUnits.findIndex(u => u.name === name && u.rank === rank);

        // item이 속한 Rate 그룹 찾기
        const groupIndex = Unit.Rate.findIndex(group =>
            group.some(([name, rank]) => name === item.name && rank === item.rank)
        );

        // 그룹 아니면 그냥 on/off
        if (groupIndex === -1) {
            item.Check = checked ? 1 : 0;
            BuffAdd(checked, item);

            const idx = Unit.allUnits.findIndex(u => u === item);
            Collect(item, idx !== -1 ? idx : fallbackIndex);

            Func.UnitTotalStun();
            CountOn();
            return;
        }

        const group = Unit.Rate[groupIndex];
        const row = group.findIndex(([name, rank]) => name === item.name && rank === item.rank);
        if (row === -1) return;

        // 현재 활성(버프 적용) 항목 찾기 (가장 높은 티어)
        const getActiveRow = () => {
            for (let i = group.length - 1; i >= 0; i--) {
                const [n, r] = group[i];
                const idx = findAllUnitIndex(n, r);
                if (idx !== -1 && !!Unit.allUnits[idx].Check) return i;
            }
            return -1;
        };

        const oldActiveRow = getActiveRow();

        // ✅ 핵심: 체크/해제에 따른 그룹 Check 상태 재설정
        // checked  : i <= row  => 1, i > row  => 0
        // unchecked: i <  row  => 1 유지, i >= row => 0 (즉, 하위 끄면 상위도 꺼짐)
        for (let i = 0; i < group.length; i++) {
            const [name, rank] = group[i];
            const idx = findAllUnitIndex(name, rank);
            if (idx === -1) continue;

            const desired = checked ? (i <= row ? 1 : 0)
                : (i <  row ? 1 : 0);

            const prev = Unit.allUnits[idx].Check ? 1 : 0;
            Unit.allUnits[idx].Check = desired;

            // UI 동기화는 무조건 해주는 게 안전(인덱스/정렬 문제 방지)
            Collect(Unit.allUnits[idx], idx);
        }

        const newActiveRow = getActiveRow();

        // 버프는 “활성 1개만”
        if (oldActiveRow !== newActiveRow) {
            if (oldActiveRow !== -1) {
                const [oldName, oldRank] = group[oldActiveRow];
                const oldIdx = findAllUnitIndex(oldName, oldRank);
                if (oldIdx !== -1) BuffAdd(false, Unit.allUnits[oldIdx]);
            }
            if (newActiveRow !== -1) {
                const [newName, newRank] = group[newActiveRow];
                const newIdx = findAllUnitIndex(newName, newRank);
                if (newIdx !== -1) BuffAdd(true, Unit.allUnits[newIdx]);
            }
        }

        group.forEach(([name, rank], i) => {
            const unit = Unit.allUnits.find(u => u.name === name && u.rank === rank);
            if (!unit) return;
            unit.Check = checked ? Number(i <= row) : Number(i < row);
            Collect(unit, Unit.allUnits.indexOf(unit));
        });
        Func.UnitTotalStun();
        CountOn();
    });

}

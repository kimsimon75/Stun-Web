import { Var, Unit } from "../import.js";

// 표시 순서만 정렬하고 버프 체크박스의 원본 인덱스는 유지합니다.
export function getSlowUnits() {
    return Unit.allUnits.filter(u => u.slow1.type !== "none" || u.slow2.type !== "none").sort((a, b) => {
        let result = 0;
        if (Var.nameSort) result = a.name.localeCompare(b.name, "ko") * Var.nameSort;
        else if (Var.rateSort) result = (Unit.unitRates[a.rank] - Unit.unitRates[b.rank]) * Var.rateSort;
        else if (Var.moveSpeedSort) result = (b.SlowCalculate - a.SlowCalculate) * Var.moveSpeedSort;
        else if (Var.afterShockSort) result = (b.EarthCalculate - a.EarthCalculate) * Var.afterShockSort;
        return result || Unit.SortFunction(a, b) || 0;
    });
}

import { Var, Unit, Func } from "../import.js";

export function refreshSlowTable() {
    let field = 0;
    for (let unitCount = 0; unitCount < Unit.allUnits.length;field++, unitCount++) {
        const u = Unit.allUnits[unitCount];

        if(u.EarthCalculate == 0 && u.SlowCalculate == 0)
        {
            field--;
            continue;
        }

        const AfterShockRate = document.getElementById(`a-${field}`);
        AfterShockRate.innerText = (u.EarthCalculate * 100).toFixed(2) + "%";

        const MoveSpeedRate = document.getElementById(`m-${field}`);
        MoveSpeedRate.innerText = (u.SlowCalculate * 100).toFixed(2) + "%";

        const unitName = document.getElementById(`n-${field}`);
        unitName.innerText = u.name;

        const unitSort = document.getElementById(`s-${field}`);
        unitSort.innerText = u.rank;
    }
    for (let i = 0; i < document.getElementsByClassName("UnitNameBar").length; i++) {

        document.getElementsByClassName("UnitNameBar")[i].textContent = (Var.nameSort == 0) ? "유닛명" : (Var.nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
        document.getElementsByClassName("UnitSortBar")[i].textContent = (Var.rateSort == 0) ? "등급" : (Var.rateSort == -1) ? "등급 ⬇" : "등급 ⬆";
        document.getElementsByClassName("MoveSpeedBar")[i].textContent = (Var.moveSpeedSort == 0) ? "이감 발동률" : (Var.moveSpeedSort == -1) ? "이감 발동률 ⬇" : "이감 발동률 ⬆";
        document.getElementsByClassName("AfterShockBar")[i].textContent = (Var.afterShockSort == 0) ? "여진 가동률" : (Var.afterShockSort == -1) ? "여진 가동률 ⬇" : "여진 가동률 ⬆";
    }
}

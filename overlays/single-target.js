import { Var, Unit, Func } from "../import.js";

export function renderSingleTarget({ itemList }) {
    Unit.Mono.forEach((item,index) =>{
        var t = 1 / item[3] * Math.min(Func.RoundX(1 + item[2] + (Var.speedBonusEx + Var.dex) / 100,3), 5);

    if(Unit.idxToRank(item[1]) === "희귀함"
    || Unit.idxToRank(item[1]) === "전설적인"
    || Unit.idxToRank(item[1]) === "히든"
    || Unit.idxToRank(item[1]) === "왜곡됨"
    || Unit.idxToRank(item[1]) === "특별함")
    {
        const findIndex = Unit.allUnits.findIndex(items => items.name === "로얄로더")
        if(Unit.allUnits[findIndex].Check > 0)
        {
            t = 1 / item[3] * Math.min(Func.RoundX(1 + item[2] + (Var.speedBonusEx + Var.dex - Unit.allUnits[findIndex].atkSpeedBuff) / 100,3), 5);
        }
    }

        const Grid = document.createElement("div");
        Grid.style.display = "grid";
        Grid.style.gridTemplateColumns = "1.5fr 1fr 1fr"

        itemList.appendChild(Grid);

        const UnitName = document.createElement("div");
        UnitName.className = "Button BigFont";
        UnitName.style.padding = "1rem";
        UnitName.style.borderRight = "none";
        if(index !== 0)
            UnitName.style.borderTop = "none";
        UnitName.innerText = item[0] + `(${Unit.idxToRank(item[1])})`;

        Grid.appendChild(UnitName);

        const first = document.createElement("div");
        first.className = "Button BigFont";
        first.style.padding = "1rem";
        first.style.borderRight = "none";
        if(index !== 0)
            first.style.borderTop = "none";

        first.innerText = Func.RoundX(Math.log(1 - item[5] * item[8]) / Math.log(1 - 0.75) * item[4] * t * 10 / 1.7, 3);


        Grid.appendChild(first);


        const second = document.createElement("div");
        second.className = "Button BigFont";
        second.style.padding = "1rem";
        if(index !== 0)
            second.style.borderTop = "none";
        second.innerText = Func.RoundX(Math.log(1 - item[7] * item[8]) / Math.log(1 - 0.75) * item[6] * t * 10/ 1.7 , 3);

        Grid.appendChild(second);

    })
}

import { Var, Unit, Func } from "../import.js";

export function renderManaTiming({ itemList }) {
    Unit.Mana.forEach((item,index) =>{
        const Grid = document.createElement("div");
        Grid.style.display = "grid";
        Grid.style.gridTemplateColumns = "1.5fr 1fr"

        itemList.appendChild(Grid);

        const UnitName = document.createElement("div");
        UnitName.className = "Button BigFont";
        UnitName.style.padding = "1rem";
        UnitName.style.borderRight = "none";
        if(index !== 0)
            UnitName.style.borderTop = "none";
        UnitName.innerText = item[0];

        Grid.appendChild(UnitName);

        const Time = document.createElement("div");
        Time.className = "Button unitSort BigFont";
        Time.style.padding = "1rem";
        if(index !== 0)
            Time.style.borderTop = "none";
        let AttackSpeedBuff = Func.RoundX((1 + item[2] + Var.speedBonusEx / 100) , 4);

        if(Unit.idxToRank(item[1]) === "초월함")
            AttackSpeedBuff += Math.round(Var.dex / 100 * 1000)/1000;
        let t = Func.RoundX(1 / item[3] * Math.min(AttackSpeedBuff, 5), 3);

        if(Unit.idxToRank(item[1]) === "희귀함"
        || Unit.idxToRank(item[1]) === "전설적인"
        || Unit.idxToRank(item[1]) === "히든"
        || Unit.idxToRank(item[1]) === "왜곡됨"
        || Unit.idxToRank(item[1]) === "특별함")
        {
            const findIndex = Unit.allUnits.findIndex(items => items.name === "로얄로더")
            if(Unit.allUnits[findIndex].Check > 0)
            {
                t = Func.RoundX(1 / item[3] * Math.min(AttackSpeedBuff - Unit.allUnits[findIndex].atkSpeedBuff / 100, 5), 3);
            }
        }

        let unitManaRegen = Var.manaRegen + Func.Brave(Var.koby) + ((Unit.idxToRank(item[1]) === "초월함") ? Var.intel * 0.08 : 0 );

        let Buffindex = Unit.allUnits.findIndex(items => {
            return (item[0] == items.name && Unit.idxToRank(item[1]) === items.rank);
        })

        t = Func.RoundX(t * 0.95,3);
        const plus = 5;
        const braveKoby = Func.Brave(Var.koby);

        function Cycle(int)
        {
            if(item[0]==="미호크")
            {
                let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + 2) ) / (t + unitManaRegen + braveKoby + 2) + item[5];
                return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
            }
            else if(item[0] === "프랑키")
            {
                const Franky = - (Unit.allUnits[Buffindex].Check > 0 ? Unit.allUnits[Buffindex].manaRegen : 0);
                let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + Franky )) / (t + unitManaRegen + braveKoby + Franky) + item[5];
                return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
            }
            else if (item[0] === "에넬")
            {
                const enel = - (Unit.allUnits[Buffindex].Check > 0 ? Unit.allUnits[Buffindex].manaRegen : 0);
                let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + enel )) / (t + unitManaRegen + braveKoby + enel) + item[5];
                return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
            }
            else if (item[0] === "류마(400스택 이상)")
            {
                const toki = Unit.allUnits.findIndex(items => {
                    return items.name === "토키";
                })
                if(Unit.allUnits[toki].Check > 0)
                {
                    AttackSpeedBuff = Func.RoundX(1 + item[2] + 0.2 + Func.RoundX(Var.speedBonusEx / 100, 3), 3);
                    t = Func.RoundX(1 / item[3] * Math.min(AttackSpeedBuff, 5), 3);
                    t = Func.RoundX(t * 0.95, 3);
                }
                let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby )) / (t + unitManaRegen + braveKoby) + item[5];
                return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
            }

            let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby) ) / (t + unitManaRegen + braveKoby) + item[5];
            return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
        }


        let [c3, c4] = [Func.RoundX(Cycle(3), 3), Func.RoundX(Cycle(4), 3)];
        let time = c3 >= Var.round ? c4 : c3;
        Time.innerText = time.toFixed(0) + "초";
        Grid.appendChild(Time);
    })
}

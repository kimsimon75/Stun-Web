import { Var, Unit, Func } from "../import.js";
import { applyFiveElderPercentDamageEffect } from "../units/five-elders-effects.js";

export function renderSingleTarget({ itemList }) {
    itemList.classList.add("single-target-list");

    const rows = document.createElement("div");
    rows.className = "single-target-rows";
    itemList.appendChild(rows);

    const getSelectedElder = () => Unit.allUnits.find(unit => unit.rank === "오로성" && unit.Check > 0);

    const renderRows = () => {
        rows.replaceChildren();
        Unit.Mono.forEach((item,index) =>{
        const damageType = item[8];
        const damageMultiplier = applyFiveElderPercentDamageEffect({
            damageType,
            damageMultiplier: Unit.Seige[damageType],
            elder: getSelectedElder(),
            difficulty: Var.difficulty,
        });
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
        Grid.className = "single-target-unit";

        rows.appendChild(Grid);

        const UnitName = document.createElement("div");
        UnitName.className = "Button BigFont";
        UnitName.style.padding = "0.4rem 0.5rem";
        UnitName.style.borderRight = "none";
        if(index !== 0)
            UnitName.style.borderTop = "none";
        UnitName.innerText = item[0] + `(${Unit.idxToRank(item[1])})`;
        UnitName.title = UnitName.innerText;

        const first = document.createElement("div");
        first.className = "Button BigFont";
        first.style.padding = "0.4rem 0.5rem";
        first.style.borderRight = "none";
        if(index !== 0)
            first.style.borderTop = "none";

        first.innerText = Func.RoundX(Math.log(1 - item[5] * damageMultiplier) / Math.log(1 - 0.75) * item[4] * t * 10 / 1.798, 3);


        const second = document.createElement("div");
        second.className = "Button BigFont";
        second.style.padding = "0.4rem 0.5rem";
        if(index !== 0)
            second.style.borderTop = "none";
        second.innerText = Func.RoundX(Math.log(1 - item[7] * damageMultiplier) / Math.log(1 - 0.75) * item[6] * t * 10/ 1.798 , 3);

        const third = document.createElement("div");
        third.className = "Button BigFont";
        third.style.padding = "0.4rem 0.5rem";
        if(index !== 0)
            third.style.borderTop = "none";
        third.innerText = damageType;

        Grid.append(UnitName, first, second, third);

        });
    };

    renderRows();
    itemList.addEventListener("difficultychange", renderRows);

    const fixedActions = document.createElement("div");
    fixedActions.className = "single-target-actions";
    fixedActions.setAttribute("role", "group");
    fixedActions.setAttribute("aria-label", "오로성 선택");

    ["나스쥬로", "워큐리", "새턴"].forEach(name => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "single-target-action";
        button.dataset.unit = name;
        const elder = Unit.allUnits.find(unit => unit.rank === "오로성" && unit.name === name);
        const initiallySelected = elder?.Check > 0;
        button.classList.toggle("is-selected", initiallySelected);
        button.setAttribute("aria-pressed", String(initiallySelected));
        button.textContent = name;
        button.addEventListener("click", () => {
            const wasSelected = button.getAttribute("aria-pressed") === "true";

            Unit.allUnits.forEach((unit, index) => {
                if (unit.rank !== "오로성" || unit.Check <= 0) return;
                Var.speedBonusEx -= unit.atkSpeedBuff;
                Var.speedDebuff -= unit.slow;
                unit.Check = 0;
                window.Collect?.(unit, index);
            });

            if (!wasSelected && elder) {
                Var.speedBonusEx += elder.atkSpeedBuff;
                Var.speedDebuff += elder.slow;
                elder.Check = 1;
                window.Collect?.(elder, Unit.allUnits.indexOf(elder));
            }

            fixedActions.querySelectorAll(".single-target-action").forEach(action => {
                const selected = !wasSelected && action === button;
                action.classList.toggle("is-selected", selected);
                action.setAttribute("aria-pressed", String(selected));
            });
            window.CountOn?.();
            renderRows();
        });
        fixedActions.appendChild(button);
    });

    itemList.appendChild(fixedActions);
}

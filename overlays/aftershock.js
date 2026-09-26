import { Var, Unit } from "../import.js";

export function renderAftershock({ itemList, unitCount }) {

    let unitNumber = 0;
    for(let count = -1; count < unitCount; unitNumber++)
    {
        if(Unit.allUnits[unitNumber].slow1.type != "none" || Unit.allUnits[unitNumber].slow2.type != "none"){
            count++;}
    }
    unitNumber--;

    const u = Unit.allUnits[unitNumber];
    let t = 1 / u.attackCycle * (((1 + u.atkSpeedBonus +
            parseFloat((Var.speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
            (1 + u.atkSpeedBonus +
                parseFloat((Var.speedBonusEx / 100).toFixed(3))));
    let s = u.slow2.dur;
    let x = u.slow2.p;
    for (let i = 0; i < 4; i++) {
        const item = document.createElement("li");
        item.textContent = `Item ${i}`;
        item.style.padding = "0.5rem 0";
        item.style.borderBottom = "0.1rem solid #ddd";

        switch (i) {
            case 0:
                item.textContent = `여진 확률 : ${(x * 100).toFixed(0)}%`;
                break;
            case 1:
                item.textContent = `여진 지속시간 : ${s.toFixed(2)}초`;
                break;
            case 2:
                item.textContent = `여진 수치 : ${u.slow2.eff}%`
                break;
            case 3:
                item.textContent = `여진 가동률 : ${(u.EarthCalculate * 100).toFixed(2)}%`;
                break;
        }

        itemList.appendChild(item);
    }
}

import { getSlowUnits } from "../main/slow-units.js";
import { Var, Unit, Func } from "../import.js";

export function renderSlow({ itemList, unitCount }) {

    const u = getSlowUnits()[unitCount];
    const totalBonus = Func.RoundX(1 + u.atkSpeedBonus + Var.speedBonusEx / 100, 3);
    const t = 1 / u.attackCycle * Math.min(totalBonus, 5);

    var s = u.slow1.dur;
    var x = u.slow1.p;
    for (let i = 0; i < 5; i++) {
        const item = document.createElement("li");
        item.textContent = `Item ${i}`;
        item.style.padding = "0.5rem 0";
        item.style.borderBottom = "0.1rem solid #ddd";

        switch (i) {
            case 0:
                item.textContent = `이감 확률 : ${(x * 100).toFixed(3)}%`;
                break;
            case 1:
                item.textContent = `이감 지속시간 : ${s.toFixed(2)}초`;
                break;
            case 2:
                item.textContent = `이감 수치 : ${u.slow1.eff}%`
                break;
            case 3:
                item.textContent = `이감 발동률 : ${(u.SlowCalculate * 100).toFixed(2)}%`;
                break;
            case 4:
                item.textContent = `이감이 다시 잡히는 평균 시간 : ${(1 / t / x).toFixed(3)}초`
                break;
        }

        itemList.appendChild(item);
    }
}

import { Var, Unit, Func } from "../import.js";
import { RoundX } from "../function.js";

export function renderNika({ itemList, sortCount, unitCount, u }) {
    var x1 = u.stun1.p;
    var s1 = u.stun1.dur;
    const rawBonus = (Unit.getUnit(sortCount, unitCount).Check)
    ? (Var.speedBonusEx + Var.dex) - u.atkSpeedBuff
    : (Var.speedBonusEx + Var.dex);

    const bonus = Func.RoundX(1 + u.atkSpeedBonus + rawBonus / 100, 3);
    const bonus2 = Func.RoundX(bonus - 2.25, 3);

    let t = 1 / u.attackCycle * Math.min(bonus, 5);
    let t2 = 1 / u.attackCycle * Math.min(bonus2, 5);
    let unitHealthRegen = Var.healthRegen + Var.intel * 0.04 + Func.Brave(Var.koby);


    let time = (4.25 + ((115 - 4.25 * (t2 + (unitHealthRegen + Var.intel*0.04) + 0.25)) / (t + (unitHealthRegen + Var.intel*0.04) + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (t2 + (unitHealthRegen + Var.intel*0.04) + 0.25)) / (t + (unitHealthRegen + Var.intel*0.04) + 0.25)));
    let unitManaRegen = Var.manaRegen + Var.intel * 0.08 + Func.Brave(Var.koby);

    var maxMana = u.mana;
    var m_stun = u.manaDuration;
    var n1 = Math.floor(s1 * t);
    var n2 = Math.floor(s1 * t2);

    for (let i = 0; i <= 21; i++) {

        const item = document.createElement("li");
        item.textContent = `Item ${i}`;
        item.style.padding = "0.5rem 0";
        item.style.borderBottom = "0.1rem solid #ddd";

        switch (i) {
            case 0:
                item.textContent = `스턴 지수 : ${Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)}스턴`
                break;
            case 1:
                item.textContent = `스턴 가동률 : ${((1 - Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2)}%`
                break;
            case 2:
                item.textContent = `일반 모드 공속 : 초당${t.toFixed(3)}`
                break;
            case 3:
                item.textContent = `거인화 모드 공속 : 초당${t2.toFixed(3)}`
                break;
            case 4:
                item.textContent = `공속 보너스(자체 버프 포함) : ${RoundX(u.atkSpeedBonus * 100, 3) + (u.Check ? 0 : u.atkSpeedBuff)}%`;
                break;
            case 5:
                item.innerText = `공속 버프 : ${u.atkSpeedBuff}%`
                break;
            case 6:
                item.innerText = `스턴 지속시간 : ${s1}초 (거인화, 일반 동일)`;
                break;
            case 7:
                item.innerText = `스턴 범위 : ${u.stun1.r} (거인화, 일반 동일)`;
                break;
            case 8:
                item.innerText = `일반 모드 스턴 확률 : ${(x1 * 100).toFixed(2)}%`
                break;
            case 9:
                item.innerText = `일반 모드 스턴 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                break;
            case 10:
                item.innerText = `일반 모드 스턴 가동률 : ${((1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) * 100).toFixed(2)}%`;
                break;
            case 11:
                item.innerText = `거인화 모드 스턴 확률 : ${(0.2 * 100).toFixed(2)}%`
                break;
            case 12:
                item.innerText = `거인화 모드 스턴 가동률 : ${((1 + (0.2 * s1 * t2 - n2 * 0.2 - 1) * Math.pow(1 - 0.2, n2)) * 100).toFixed(2)}%`;
                break;
            case 13:
                item.innerText = `거인화 모드 스턴 수치 : ${(Math.log(-(0.2 * s1 * t2 - n2 * 0.2 - 1) * Math.pow(1 - 0.2, n2)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                break;
            case 14:
                item.innerText = `거인화 모드 지속시간 : 4.25초`;
                break;
            case 15:
                item.innerText = `거인화 모드 주기 : ${time.toFixed(2)}초`;
                break;
            case 16:
                item.innerText = `거인화 모드 비중 : ${(4.25 / time * 100).toFixed(2)}%`;
                break;
            case 17:
                item.innerText = `마나통 : ${maxMana}`;
                break;
            case 18:
                item.innerText = `마나 스턴 지속시간 : ${m_stun}초`;
                break;
            case 19:
                item.innerText = `마나 스턴 범위 : ${u.manaRange}`;
                break;
            case 20:
                item.innerText = `마나 스턴 가동률 : ${(m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + unitManaRegen) * 100).toFixed(2)}%`
                break;
            case 21:
                item.innerText = `마나 스턴 수치 : ${(Math.log(1 - (m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + unitManaRegen))) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`
                break;
        }
        itemList.appendChild(item);
    }
}

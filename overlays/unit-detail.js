import { Var, Unit, Func } from "../import.js";
import { RoundX } from "../function.js";
import { unitStunDeviation } from "../units/stun-deviation.js";

export function renderUnitDetail({ itemList, sortCount, unitCount, u }) {
    let x1 = u.stun1.p;
    let x2 = (1 - u.stun1.p) * u.stun2.p;
    let s1 = u.stun1.dur;
    let s2 = u.stun2.dur;
    const bonus = Func.RoundX(1 + u.atkSpeedBonus + (Unit.getUnit(sortCount, unitCount).Check ? 0 : Var.speedBonusEx / 100), 3);
    let t = 1 / u.attackCycle * Math.min(bonus, 5);
    let unitManaRegen = Var.manaRegen + Func.Brave(Var.koby) + ((Unit.idxToRank(sortCount) === "초월함") ? Var.intel * 0.08 : 0) ;
    let unitHealthRegen = Var.healthRegen + Func.Brave(Var.koby) + ((Unit.idxToRank(sortCount) === "초월함") ? Var.intel * 0.04 : 0);

    let maxMana = u.mana;
    let m_stun = u.manaDuration;
    let n1 = Math.floor(s1 * t);
    let n2 = Math.floor(s2 * t);

    if (u.name === "라분") {
        t = 1 / u.StunAttackInterval;
        const note = document.createElement("li");
        note.innerText = "스턴 발동 후 0.65초 대기하고 다시 공격합니다. 1~6타는 각각 27%, 7타는 확정 스턴입니다. 첫 타격 지연은 0.39초를 공속 배율로 나눠 반영합니다.";
        itemList.appendChild(note);
    }

    if (u.showSkillBreakdown) {
        const note = document.createElement("li");
        note.innerText = "샷건과 로켓은 각각 계산합니다. 마나 설정을 켜면 총 스턴 지수·가동률에 로켓을 합산하고, 끄면 샷건만 반영합니다.";
        itemList.appendChild(note);
    }

    for (let i = 1; i <= 22; i++) {
        const item = document.createElement("li");
        item.textContent = `Item ${i}`;
        item.style.padding = "0.5rem 0";
        item.style.borderBottom = "0.1rem solid #ddd";

        if(u.stun1.type == "none" && i>= 6 && i <=10 )
            i = 12;

        if (u.stun2.type == "none" && i >= 12 && i <= 16)
            i = 18;
        if (maxMana == 0 && i >= 18 && i <= 22)
        {
            i = 22;
            continue;
        }
        switch (i) {
            case 1:
                item.innerText = "스턴 지수 : " + Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
                break;
            case 2:
                item.innerText = "스턴 가동률 : " + ((1 - Math.pow(Var.StunCalCulation,Unit.getUnit(sortCount, unitCount).StunCalCulate))*100).toFixed(2) + "%";
                break;
            case 3:
                item.innerText = `공속 : 초당${t.toFixed(3)}`;
                break;
            case 4:
                item.innerText = `공속 보너스(자체 버프 포함) : ${RoundX(u.atkSpeedBonus * 100, 3) + (u.Check ? 0 : u.atkSpeedBuff)}%`;

                break;
            case 5:
                item.innerText = `공속 버프 : ${u.atkSpeedBuff}%`
                break;
            case 6:
                if (u.showSkillBreakdown) {
                    item.innerText = `샷건 발동 확률 : ${(x1 * 100).toFixed(2)}%`;
                    break;
                }
                if(Unit.idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아") item.innerText = `스턴 1 쿨타임 : ${x1}초`;
                else item.innerText = `스턴 1 확률 : ${(x1 * 100).toFixed(2)}%`
                break;
            case 7:
                item.innerText = `스턴 1 지속시간 : ${s1}초`;
                break;
            case 8:
                item.innerText = `스턴 1 범위 : ${u.stun1.r}`;
                break;
            case 9:
                if (u.name == "루피") {
                    let n3 = Math.ceil(1.75 * t);
                    let time = n3 / t;
                    let n4 = Math.floor((2.75 - time) * t);
                    item.innerText = `스턴 1 수치 : ${(Math.log(1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                }
                else if(Unit.idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아")
                {
                    item.innerText = `스턴 1 수치 : ${Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)} 스턴`
                }
                else if (u.name == "라분") {
                    item.innerText = `스턴 1 수치 : ${Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)}스턴`;
                }
                else
                    item.innerText = `스턴 1 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                break;
            case 10:
                if (u.name == "라분" || (Unit.idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아")) {
                    item.innerText = `스턴 1 샐 확률 : ${(Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)*100).toFixed(2)}%`;
                }
                else if (u.name == "루피")
                {
                    let n3 = Math.ceil(1.75 * t);
                    let time = n3 / t;
                    let n4 = Math.floor((2.75 - time) * t);
                    item.innerText = `스턴 1 샐 확률 : ${((1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) * 100).toFixed(2)}%`
                }
                else
                    item.innerText = `스턴 1 샐 확률 : ${(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * 100).toFixed(2)}%`;
                break;
            case 11:
                if (u.name === "라분") {
                    const estimate = unitStunDeviation(u);
                    item.innerText = estimate
                        ? `스턴 1 편차 (10초) : ±${estimate.deviationPercent.toFixed(2)}%`
                        : "스턴 1 편차 : 측정 불가";
                }
                else if (u.UnitName == "루피") {
                    item.innerText = `스턴 1 편차 : ${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                }
                else
                    item.innerText = `스턴 1 편차 : ${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                break;
            case 12:
                item.innerText = `스턴 2 확률 : ${(u.stun2.p * 100).toFixed(2)}%`
                break;
            case 13:
                item.innerText = `스턴 2 지속시간 : ${s2}초`;
                break;
            case 14:
                item.innerText = `스턴 2 범위 : ${u.stun2.r}`;
                break;
            case 15:
                item.innerText = `스턴 2 수치 : ${(Math.log(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                break;
            case 16:
                item.innerText = `스턴 2 샐 확률 : ${(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * 100).toFixed(2)}%`;
                break;
            case 17:
                item.innerText = `스턴 2 편차 : ${((n2 + 1 + 1 / x2) / t - s2).toFixed(3)}초`;
                break;
            case 18:
                item.innerText = u.showSkillBreakdown ? `로켓 필요 마나 : ${maxMana}` : `마나(체력) 통 : ${maxMana}`;
                break;
            case 19:
                item.innerText = u.showSkillBreakdown ? `로켓 연속 기절 지속시간 : ${m_stun}초` : `마나(체력)스턴 지속시간 : ${m_stun}초`;
                break;
            case 20:
                item.innerText = `마나(체력)스턴 범위 : ${u.manaRange}`;
                break;
            case 21:
                item.innerText = u.showSkillBreakdown ? "로켓 마나 스턴 수치 (별도) : " : `마나(체력)스턴 수치 : `;
                if (u.name === "샹크스" && Unit.idxToRank(sortCount) == '초월함') {
                    item.innerText += (Math.log((1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35)) / Math.log(Var.StunCalCulation)).toFixed(3);
                }
                else if (u.name === "아오키지" && Unit.idxToRank(sortCount) == '초월함') {
                    item.innerText += (Math.log(1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * unitManaRegen))) + 50 / (t + unitManaRegen))) / Math.log(Var.StunCalCulation)).toFixed(3);
                }
                else if (u.name === "흰수염") {
                    item.innerText += (Math.log(1 - m_stun / (maxMana / (t + unitHealthRegen + 0.5))) / Math.log(Var.StunCalCulation)).toFixed(3);
                }
                else if (u.name === "키드" && Unit.idxToRank(sortCount) == '초월함') {
                    item.innerText += (Math.log(1 - m_stun / (maxMana / (t + unitHealthRegen + 0.2))) / Math.log(Var.StunCalCulation)).toFixed(3);
                }
                else if (maxMana)
                    item.innerText += (Math.log(1 - m_stun / (maxMana / (unitManaRegen + t))) / Math.log(Var.StunCalCulation)).toFixed(3);
                else
                    item.innerText += 0;
                item.innerText += '스턴';
                break;
            case 22:
                item.innerText = `마나(체력)스턴 공백 :`;
                if (u.name === "샹크스" && Unit.idxToRank(sortCount) == '초월함') {
                    item.innerText += ((1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35) * 100).toFixed(2);
                }
                else if (u.name === "아오키지" && Unit.idxToRank(sortCount) == '초월함') {
                    item.innerText += ((1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * unitManaRegen))) + 50 / (t + unitManaRegen))) * 100).toFixed(2);
                }
                else if (u.name === "흰수염") {
                    item.innerText += ((1 - ((maxMana != 0) ? m_stun / (maxMana / (t + unitHealthRegen + 0.5)) : 0)) * 100).toFixed(2);
                }
                else if (u.name === "키드" && Unit.idxToRank(sortCount) == '초월함') {
                    item.innerText += (( 1 - m_stun / (maxMana / (t + unitHealthRegen + 0.2))) * 100).toFixed(2);
                }
                else if (maxMana)
                    item.innerText += ((1 - m_stun / (maxMana / (unitManaRegen + t))) * 100).toFixed(2);
                else
                    item.innerText = 0;
                item.innerText += `%`;
                break;

            }

            itemList.appendChild(item);
        }
}

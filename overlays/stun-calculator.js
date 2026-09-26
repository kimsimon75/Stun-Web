import { Var, Func } from "../import.js";

export function renderStunCalculator({ overlayContent }) {
    for(let i=0; i<=5;i++)
    {   overlayContent.style.margin = "auto";

        const item = document.createElement("div");

        const input = document.createElement("input");
        input.type = "number";
        input.style.fontSize = "0.65vw";
        input.style.width = "90%";
        input.style.padding = "0.4vw";
        input.style.margin = "0.2vw 0.2vw";

        switch(i)
        {
            case 0:
                item.textContent = "공격 주기: ";
                input.id = "attack_speed";
                break;
            case 1:
                item.textContent = "공속 보너스 (%): ";
                input.id = "attack_speed_bonus";
                break;
                case 2:
                    item.textContent = "스턴 1 확률 (%): ";
                    input.id = "stun1_prob";
                    break;
                case 3:
                    item.textContent = "스턴 1 지속시간 (초): ";
                    input.id = "stun1_duration";
                    break;
                    case 4:
                    item.textContent = "스턴 2 확률 (%): ";
                    input.id = "stun2_prob";
                    break;
                case 5:
                    item.textContent = "스턴 2 지속시간 (초): ";
                    input.id = "stun2_duration";
                    break;
        }
        item.appendChild(input);
        overlayContent.appendChild(item);

    }

    const StunButton = document.createElement("button");
    StunButton.className = "StunButton BigFont";
    StunButton.innerText = "입  력";
    StunButton.style.width = "100%";
    StunButton.style.padding = "0.4vw";
    StunButton.style.marginTop = "0.4vw";

    ButtonColor(StunButton);


    StunButton.addEventListener("click", ()=>{
        document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));


        const attack_speed = parseFloat(document.getElementById("attack_speed").value);
        const attack_speed_bonus = parseFloat(document.getElementById("attack_speed_bonus").value);
        const t = attack_speed / Math.min(1 + Func.RoundX(attack_speed_bonus / 100, 3), 5);

        const bigOne = document.getElementById("stun1_duration").value > document.getElementById("stun2_duration").value ? true : false;

        let x1 = Func.RoundX(document.getElementById("stun1_prob").value / 100,3);
        const s1 = document.getElementById("stun1_duration").value;

        let x2 = Func.RoundX(document.getElementById("stun2_prob").value / 100,3);
        const s2 = document.getElementById("stun2_duration").value;

        x1 = bigOne ? x1 : (x1 - x1 * x2);
        x2 = !bigOne ? x2 : (x2 - x1 * x2);

        const degree1 = Func.StunCalCulator(t, x1, s1, t);
        const degree2 = Func.StunCalCulator(t, x2, s2, t);
        if(attack_speed===0 || attack_speed_bonus === 0 || x1 === 0 || s1 === 0)
            alert("잘못된 정보입니다.");
        else
        for(let i=0;i<=6;i++)
        {
            const Stun = document.createElement("div");
            Stun.className = "StunDocument SmallFont"
            switch(i)
            {
                case 0:
                    Stun.innerText = `공격 속도 : ${(1/t).toFixed(3)}`
                    break;
                case 1:
                    Stun.innerText = `스턴 1 등급 : ${(Math.log(1-degree1) / Math.log(Var.StunCalCulation)).toFixed(3)} 스턴`
                    break;
                case 2:
                    Stun.innerText = `스턴 1 가동률 : ${(degree1*100).toFixed(3)} %`
                    break;
                case 3:
                    Stun.innerText = `스턴 2 등급 : ${(Math.log(1-degree2) / Math.log(Var.StunCalCulation)).toFixed(3)} 스턴`
                    break;
                case 4:
                    Stun.innerText = `스턴 2 가동률 : ${(degree2*100).toFixed(3)} %`
                    break;
                case 5:
                    Stun.innerText = `총 스턴 : ${(Math.log((1 - degree1) * (1 - degree2)) / Math.log(Var.StunCalCulation)).toFixed(3)} 스턴`
                    break;
                case 6:
                    const doublePercentage = Func.RoundX(1 - (1 - x1) * (1 - x2), 10);
                    Stun.innerText = `총 편차 : ${(t / doublePercentage).toFixed(3)}초`
                    break;
            }
            overlayContent.appendChild(Stun);
        }
    })

    overlayContent.appendChild(StunButton);
}

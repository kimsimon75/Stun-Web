import { Func } from "../import.js";

export function renderPhysicalDamage({ overlayContent }) {
    for(let i=0; i<3;i++)
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
                item.textContent = "유닛 방어력: ";
                input.id = "unit_armor";
                break;
            case 1:
                item.textContent = "현재 방깍: ";
                input.id = "current_armor_remover";
                break;
                case 2:
                    item.textContent = "추가될 방깍: ";
                    input.id = "next_armor_remover";
                    break;
        }
        item.appendChild(input);
        overlayContent.appendChild(item);

    }

    const armorButton = document.createElement("button");
    armorButton.className = "StunButton BigFont";
    armorButton.innerText = "입  력";
    armorButton.style.width = "100%";
    armorButton.style.padding = "0.4vw";
    armorButton.style.marginTop = "0.4vw";

    ButtonColor(armorButton);


    armorButton.addEventListener("click", ()=>{
        document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));


        const unit_armor = parseInt(document.getElementById("unit_armor").value);
        const current_armor_remover = parseInt(document.getElementById("current_armor_remover").value);

        const next_armor_remover = parseInt(document.getElementById("next_armor_remover").value);

        for(let i=0;i<7;i++)
        {
            const armor = document.createElement("div");
            armor.className = "StunDocument BigFont"

            let current_damage = Func.RoundX(100/(100 + 2 * (unit_armor - current_armor_remover)), 20);
            let next_damage = Func.RoundX(100/ (100 + 2* (unit_armor - current_armor_remover - next_armor_remover)),20);
        if(current_armor_remover>unit_armor)
        {
            const effectiveDiff = Math.min(current_armor_remover - unit_armor, 20);
            current_damage = Func.RoundX(2 - Math.pow(0.94, effectiveDiff), 6); // 소수점 6자리 정도면 충분
        }
        if(current_armor_remover+next_armor_remover > unit_armor)
        {
            const effectiveDiff = Math.min(current_armor_remover + next_armor_remover - unit_armor, 20);
            next_damage = Func.RoundX(2 - Math.pow(0.94, effectiveDiff), 6); // 소수점 6자리 정도면 충분
        }

            switch(i)
            {
                case 0:
                    armor.innerText = `방깍이 없을시 물리피해 계수: ${(100/(100 + 2 * unit_armor) * 100).toFixed(2)}%`
                    break;
                case 1:
                    armor.innerText = `방깍 계산된 물리피해 계수: ${(current_damage*100).toFixed(2)}%`
                    break;
                case 2:
                    armor.innerText = `방깍 계산된 물리피해 계수(짭플): ${(Math.pow(current_damage, 2)*100).toFixed(2)}%`
                    break;
                case 3:
                    armor.innerText = `방깍 추가시 딜 증가 수치: ${((next_damage - current_damage) * 100).toFixed(2)}%`
                    break;
                case 4:
                    armor.innerText = `방깍 추가시 딜 증가 수치(짭플): ${((Math.pow(next_damage,2) - Math.pow(current_damage,2))*100).toFixed(2)}%`
                    break;
                case 5:
                    armor.innerText = `방깍 추가시 딜 증가율 ${((next_damage - current_damage) / current_damage).toFixed(2)}배`
                    break;
                case 6:
                    armor.innerText = `방깍 추가시 딜 증가율(짭플): ${((Math.pow(next_damage, 2) - Math.pow(current_damage, 2)) / Math.pow(current_damage, 2)).toFixed(2)}배`
                    break;
            }
            overlayContent.appendChild(armor);
        }
    })

    overlayContent.appendChild(armorButton);
}

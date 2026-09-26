import { Unit } from "../import.js";
import { CheckEvent } from "./buff-events.js";

export function populateBuffMenus(DebuffOverlay, DebuffScroll, HRegenOverlay, HRegenScroll, MRegenOverlay, MRegenScroll, SpeedBonusExOverlay, speedBonusExScroll) {
    DebuffOverlay.appendChild(DebuffScroll);
    HRegenOverlay.appendChild(HRegenScroll);
    MRegenOverlay.appendChild(MRegenScroll);
    SpeedBonusExOverlay.appendChild(speedBonusExScroll);

    const Scrolls = [speedBonusExScroll, MRegenScroll, HRegenScroll, DebuffScroll];

    Unit.allUnits.forEach((item, index) => {
        const items = [];
        items[0] = item.atkSpeedBuff;
        items[1] = item.manaRegen;
        items[2] = item.healthRegen;
        items[3] = item.slow;

        for(let i=0;i<=3;i++)
        {
            if(items[i]!==0)
            {

                const menu = document.createElement("label");
                menu.className = "CheckBox-Stack";
                menu.style.border = "0.001rem solid black";
                Scrolls[i].appendChild(menu);

                const unitName = document.createElement("p");
                unitName.innerText = `${item.name}(${item.rank}) ${items[i]}${(i===0||i==3) ? "%" : ""}`;
                switch(i)
                {
                    case 0:
                        unitName.className = `u-s${index}`;
                        break;
                    case 1:
                        unitName.className = `u-m${index}`;
                        break;
                    case 2:
                        unitName.className = `u-h${index}`;
                        break;
                    case 3:
                        unitName.className = `u-d${index}`;
                        break;
                }
                unitName.style.margin = "0";
                unitName.style.padding = "0.5rem";
                menu.appendChild(unitName);

                const Check = document.createElement("input");
                Check.type = "checkbox";
                const CheckName = [`s${index}`,`m${index}`,`h${index}`,`d${index}`];
                Check.className = CheckName[i];
                Check.style.position = 'relative';
                Check.style.zIndex = 10;
                Check.style.marginRight = "0.7vw";
                Check.style.transform = "scale(1.5)";
                Check.dataset.value = items[i];
                Check.checked = item.Check;

                CheckEvent(Check, item, index);

                menu.appendChild(Check);
            }
        }

    })

}

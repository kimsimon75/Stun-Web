import { Var } from "../import.js";
import { ButtonColor } from "./button-style.js";

export function createManaControl(MRegenOverlay, MRegenScroll) {
    const MRegenButton = document.createElement("div");
    MRegenButton.className = "MRegen Button SmallFont";
    MRegenButton.id = "MRegen";
    MRegenButton.innerText = `${Var.manaRegen}`;
    MRegenButton.style.boxSizing = "border-box";
    MRegenButton.style.textAlign = "right";
    MRegenButton.style.alignContent = "center";
    MRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(MRegenButton);

    MRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (MRegenOverlay.style.visibility === "hidden") {
            MRegenScroll.style.visibility = "visible";
            MRegenOverlay.style.visibility = "visible";
            const rect = MRegenButton.getBoundingClientRect();
            const dropdownHeight = MRegenScroll.offsetHeight || 160;

            MRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            MRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            MRegenScroll.style.visibility = "hidden";
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(MRegenButton);
    MRegenScroll.style.width = `${(MRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const MRegen = document.createElement("div");
    MRegen.className = "Bonus SmallFont";
    MRegen.innerText = "마나 리젠";
    MRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(MRegen);
}

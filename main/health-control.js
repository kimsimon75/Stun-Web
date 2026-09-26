import { Var } from "../import.js";
import { ButtonColor } from "./button-style.js";

export function createHealthControl(HRegenOverlay, HRegenScroll, MRegenOverlay) {
    const HRegenButton = document.createElement("div");
    HRegenButton.className = "HRegen Button SmallFont";
    HRegenButton.id = "HRegen";
    HRegenButton.innerText = `${Var.healthRegen}`;
    HRegenButton.style.boxSizing = "border-box";
    HRegenButton.style.textAlign = "right";
    HRegenButton.style.alignContent = "center";
    HRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(HRegenButton);

    HRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (HRegenOverlay.style.visibility === "hidden") {
            HRegenScroll.style.visibility = "visible";
            HRegenOverlay.style.visibility = "visible";
            const rect = HRegenButton.getBoundingClientRect();
            const dropdownHeight = HRegenScroll.offsetHeight || 160;

            HRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            HRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            HRegenScroll.style.visibility = "hidden";
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(HRegenButton);
    HRegenScroll.style.width = `${(HRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const HRegen = document.createElement("div");
    HRegen.className = "Bonus SmallFont";
    HRegen.innerText = "체력 리젠";
    HRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(HRegen);
}

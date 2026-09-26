import { Var, Overlay } from "../import.js";
import { ButtonColor } from "./button-style.js";

export function createDebuffControl(DebuffOverlay, DebuffScroll) {
    const MoveSpeedDebuffButton = document.createElement("div");
    MoveSpeedDebuffButton.className = "Debuff Button SmallFont";
    MoveSpeedDebuffButton.style.textAlign = "right";
    MoveSpeedDebuffButton.style.alignContent = "center";
    MoveSpeedDebuffButton.style.paddingRight = "0.25vw";
    MoveSpeedDebuffButton.innerText = Var.speedDebuff + "%";

    ButtonColor(MoveSpeedDebuffButton);

    MoveSpeedDebuffButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (DebuffOverlay.style.visibility === "hidden") {
            DebuffOverlay.style.visibility = "visible";
            DebuffScroll.style.visibility = "visible";
            const rect = MoveSpeedDebuffButton.getBoundingClientRect();
            const dropdownHeight = DebuffScroll.offsetHeight || 160;

            DebuffScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            DebuffScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            DebuffScroll.style.visibility = "hidden";
            DebuffOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(MoveSpeedDebuffButton);

    const Debuff = document.createElement("div");
    Debuff.className = "Button Bonus SmallFont";
    Debuff.innerText = "이속 감소";

    ButtonColor(Debuff);

    Debuff.addEventListener("click", () =>Overlay.openOverlay(300, 300));

    document.getElementsByClassName('Stack1')[0].appendChild(Debuff);

}

import { Overlay, Var, Func } from "../import.js";
import { ButtonColor } from "./button-style.js";
import { CountOn } from "./refresh.js";

export function createCalculatorButtons(bar) {
    const Formula = document.createElement("div");
    Formula.className = "Button Formula SmallFont";
    Formula.innerText = "가동률\n공식";
    Formula.style.alignContent = "center";
    Formula.style.textAlign = "center";
    Formula.style.padding = ".5vw 0 .5vw 0";
    Formula.addEventListener("click", () => {
        Overlay.openOverlay(200, 200);
    });
    ButtonColor(Formula);

    bar.appendChild(Formula);

    const StunCalCulateMachine = document.createElement("div");
    StunCalCulateMachine.className = "Button SmallFont";
    StunCalCulateMachine.innerText = "스턴\n계산기";
    StunCalCulateMachine.style.alignContent = "center";
    StunCalCulateMachine.style.textAlign = "center";
    StunCalCulateMachine.addEventListener("click", () =>
    {
        Overlay.openOverlay(400, 400);
    })

    bar.appendChild(StunCalCulateMachine);
    ButtonColor(StunCalCulateMachine);

    const ManaControlCalculate = document.createElement("div");
    ManaControlCalculate.className = "Button SmallFont";
    ManaControlCalculate.innerText = "마나뻥\n계산기";
    ManaControlCalculate.style.alignContent = "center";
    ManaControlCalculate.style.textAlign = "center";
    ManaControlCalculate.addEventListener("click", () =>
    {
        Overlay.openOverlay(500, 500);
    })

    bar.appendChild(ManaControlCalculate);
    ButtonColor(ManaControlCalculate);

    if (document.getElementById("container1")) {
        const Mana = document.createElement("div");
        Mana.className = "Button Mana SmallFont";
        Mana.innerText = "마나\n끄기";
        Mana.style.alignContent = "center";
        Mana.style.textAlign = "center";
        Mana.addEventListener("click", () => {
            if (Var.mana)
                Mana.innerText = "마나\n켜기";
            else
                Mana.innerText = "마나\n끄기";
            Var.mana = !Var.mana;
            Func.UnitTotalStun();
            CountOn();
        });

        ButtonColor(Mana);
        bar.appendChild(Mana);
    }

    const Physical = document.createElement("div");
    Physical.className = "Button SmallFont";
    Physical.innerText = "방깍\n계산";
    Physical.style.alignContent = "center";
    Physical.style.textAlign = "center";

    Physical.addEventListener('click', () => {
        Overlay.openOverlay(600, 600);
    });

    ButtonColor(Physical);
    bar.appendChild(Physical);

    const Ryuma = document.createElement("div");
    Ryuma.className = "Button SmallFont";
    Ryuma.innerText = "오니\n가르기";
    Ryuma.style.alignContent = "center";
    Ryuma.style.textAlign = "center";

    Ryuma.addEventListener('click', () => {
        Overlay.openOverlay(700, 700);
    });

    ButtonColor(Ryuma);
    bar.appendChild(Ryuma);

    const mono = document.createElement("div");
    mono.className = "Button SmallFont";
    mono.innerText = "단일\n효율";
    mono.style.alignContent = "center";
    mono.style.textAlign = "center";

    mono.addEventListener('click', () => {
        Overlay.openOverlay(800, 800);
    });

    ButtonColor(mono);
    bar.appendChild(mono);
}

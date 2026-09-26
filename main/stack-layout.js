import { Var, Overlay } from "../import.js";
import { ButtonColor } from "./button-style.js";
import { ClearAll } from "./clear-all.js";

export function createStackLayout() {
    for (let i = 0; i <= 5; i++) {
        const Stack = document.createElement("div");
        Stack.className = `Stack${i}`
        Stack.style.display = "grid";
        Stack.style.gridArea = ` ${Var.containerGrid - i} / 3 /  ${Var.containerGrid + 1 - i} / 4`;

        document.getElementsByClassName("container")[0].appendChild(Stack);

        if (i === 0)
            Stack.style.gridTemplateColumns = "6fr 4fr";
        else
            Stack.style.gridTemplateColumns = "repeat(4, 1fr)";
    }

    const TotalStun = document.createElement("div");
    TotalStun.className = 'Button TotalStun SmallFont';
    TotalStun.addEventListener('click', () => {
        Overlay.openOverlay(100, 100);
    });
    TotalStun.innerText = `${Var.totalStun.toFixed(3)}스턴`;
    ButtonColor(TotalStun);

    document.getElementsByClassName(`Stack0`)[0].appendChild(TotalStun);

    const clear = document.createElement("div");
    clear.className = "Button clear SmallFont";
    clear.innerText = '초기화';
    clear.addEventListener("click", ()=>{
        ClearAll();
    });
    ButtonColor(clear);

    document.getElementsByClassName(`Stack0`)[0].appendChild(clear);

}

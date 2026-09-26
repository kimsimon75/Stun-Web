import { Var, Func } from "../import.js";
import { CountOn } from "./refresh.js";
import { ButtonColor } from "./button-style.js";

export function parseStatValue(value, integer = false) {
    const number = Number(value.trim());
    if (!Number.isFinite(number) || number < 0 || (integer && !Number.isInteger(number))) return null;
    return number;
}

export function createStatControl(bar, label, key, integer = false) {
    const caption = document.createElement("div");
    caption.className = "Button SmallFont";
    caption.innerText = label;
    caption.style.textAlign = "center";
    caption.style.alignContent = "center";
    const button = document.createElement("div");
    button.className = "Button SmallFont";
    button.dataset.stat = key;
    button.innerText = String(Var[key]);
    button.style.textAlign = "right";
    button.style.alignContent = "center";
    button.setAttribute("aria-label", label + " 입력");
    ButtonColor(button);
    bar.append(caption, button);
    button.addEventListener("click", () => {
        if (button.style.display === "none") return;
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = integer ? "1" : "any";
        input.value = String(Var[key]);
        input.dataset.statInput = key;
        input.className = "SmallFont";
        input.setAttribute("aria-label", label);
        input.style.width = getComputedStyle(button).width;
        button.style.display = "none";
        button.after(input);
        let finished = false;
        const finish = (cancel = false) => {
            if (finished) return;
            finished = true;
            const value = parseStatValue(input.value, integer);
            if (!cancel && value !== null) Var[key] = value;
            button.innerText = String(Var[key]);
            input.remove();
            button.style.display = "";
            Func.UnitTotalStun();
            CountOn();
        };
        input.addEventListener("blur", () => finish());
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") input.blur();
            else if (event.key === "Escape") { finish(true); button.focus(); }
        });
        input.focus();
        input.select();
    });
}

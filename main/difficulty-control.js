import { Var } from "../import.js";

export function createDifficultyControl(bar) {
    const control = document.createElement("div");
    control.className = "difficulty-control";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", "난이도 선택");

    [["god", "신"], ["nightmare", "악몽"]].forEach(([value, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "difficulty-button";
        button.dataset.difficulty = value;
        button.textContent = label;

        const sync = () => {
            const selected = Var.difficulty === value;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        };
        sync();

        button.addEventListener("click", () => {
            Var.difficulty = value;
            control.querySelectorAll(".difficulty-button").forEach(item => {
                const selected = item.dataset.difficulty === value;
                item.classList.toggle("is-selected", selected);
                item.setAttribute("aria-pressed", String(selected));
            });
            document.querySelector(".single-target-list")?.dispatchEvent(new Event("difficultychange"));
        });

        control.appendChild(button);
    });

    bar.appendChild(control);
}

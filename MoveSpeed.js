import { Var, Overlay } from "./import.js";
import { getSlowUnits } from "./main/slow-units.js";
import { CountOn } from "./main/refresh.js";
import { ButtonColor } from "./main/button-style.js";

export function openMoveSpeedPage() {
    if (document.getElementById("container2")) return;
    const container = document.getElementById("container1");
    if (!container) return;
    const page = document.createElement("div");
    page.id = "container2";
    page.className = "container";
    page.style.gridTemplateRows = `repeat(${Var.containerGrid}, 1fr)`;
    container.replaceWith(page);
    const headings = [
        ["유닛명", "UnitNameBar", "nameSort"],
        ["등급", "UnitSortBar", "rateSort"],
        ["이감 발동률", "MoveSpeedBar", "moveSpeedSort"],
        ["여진 가동률", "AfterShockBar", "afterShockSort"],
    ];
    function row() {
        const element = document.createElement("div");
        element.style.display = "grid";
        element.style.gridTemplateColumns = "repeat(4, 1fr)";
        page.appendChild(element);
        return element;
    }
    getSlowUnits().forEach((unit, index) => {
        if (index % (Var.containerGrid - 1) === 0) {
            const header = row();
            for (const [label, className, key] of headings) {
                const button = document.createElement("button");
                button.className = "Button unitSort MoreSmallFont " + className;
                button.textContent = label;
                button.addEventListener("click", () => {
                    const direction = Var[key] <= 0 ? 1 : -1;
                    for (const [, , sortKey] of headings) Var[sortKey] = 0;
                    Var[key] = direction;
                    CountOn();
                });
                ButtonColor(button);
                header.appendChild(button);
            }
        }
        const element = row();
        for (const [prefix, effect, sort] of [["n", null, null], ["s", null, null], ["m", "slow1", -1], ["a", "slow2", -2]]) {
            const cell = document.createElement(effect ? "button" : "div");
            cell.id = prefix + "-" + index;
            cell.className = effect ? "Button SmallFont" : "unitName SmallFont";
            if (effect) {
                cell.addEventListener("click", () => {
                    const current = getSlowUnits()[index];
                    if (current && current[effect].type !== "none") Overlay.openOverlay(sort, index);
                });
                ButtonColor(cell);
            }
            element.appendChild(cell);
        }
    });
    // 기존 컨트롤을 재사용해 숨겨진 창과 이벤트의 중복 생성을 막습니다.
    const stacks = Array.from(container.children).filter(el => /^Stack[0-5]$/.test(el.className));
    stacks.forEach(el => page.appendChild(el));
    const viewButtons = Array.from(page.querySelectorAll(".Stack4 > button"));
    viewButtons.forEach(button => { button.hidden = true; });
    const back = document.createElement("button");
    back.className = "Button Stun SmallFont";
    back.textContent = "스턴";
    back.style.gridArea = "1/4/2/5";
    back.addEventListener("click", () => {
        stacks.forEach(el => container.appendChild(el));
        viewButtons.forEach(button => { button.hidden = false; });
        back.remove();
        page.replaceWith(container);
        CountOn();
    });
    ButtonColor(back);
    page.querySelector(".Stack4").appendChild(back);
    CountOn();
}

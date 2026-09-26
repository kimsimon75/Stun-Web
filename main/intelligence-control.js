import { ButtonColor } from "./button-style.js";
import { Var, Func } from "../import.js";
import { CountOn } from "./refresh.js";

export function createIntelligenceControl(bar) {
    const Intel = document.createElement("div");
    Intel.className = "Button SmallFont";
    Intel.innerText = "지능";
    Intel.style.alignContent = "center";
    Intel.style.textAlign = "center";

    bar.appendChild(Intel);

    const IntelButton = document.createElement("div");
    IntelButton.className = "Button SmallFont";
    IntelButton.innerText = "0";
    IntelButton.style.paddingRight = "0.25vw";
    IntelButton.style.alignContent = "center";
    IntelButton.style.textAlign = "right";

    ButtonColor(IntelButton);
    bar.appendChild(IntelButton);

    // 버튼을 클릭하면 input으로 변환
    IntelButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = IntelButton.innerText;
        input.className = "SmallFont";
        input.style.textAlign = "right";
        input.style.boxSizing = "border-box";
        input.style.width = getComputedStyle(IntelButton).width;

        // 버튼 숨기기
        IntelButton.style.display = "none";

        // 버튼 다음에 input 삽입
        IntelButton.after(input);
        input.focus();

        function revertToButton() {
            IntelButton.innerText = input.value; // 입력값 유지
            Var.intel = input.value;
            Func.UnitTotalStun();
            CountOn();
            input.remove(); // input 삭제
            IntelButton.style.display = ""; // 버튼 다시 표시
        }

        input.addEventListener("blur", revertToButton);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                this.blur();
            }
        });

    });
}

import { ButtonColor } from "./button-style.js";
import { Var, Func } from "../import.js";
import { CountOn } from "./refresh.js";

export function createDexterityControl(bar) {
    const Dex = document.createElement("div");
    Dex.className = "Button SmallFont";
    Dex.innerText = "민첩성";
    Dex.style.alignContent = "center";
    Dex.style.textAlign = "center";

    bar.appendChild(Dex);

    const DexButton = document.createElement("div");
    DexButton.className = "Button SmallFont";
    DexButton.innerText = "0";
    DexButton.style.paddingRight = "0.25vw";
    DexButton.style.alignContent = "center";
    DexButton.style.textAlign = "right";

    ButtonColor(DexButton);
    bar.appendChild(DexButton);

    // 버튼을 클릭하면 input으로 변환
    DexButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = DexButton.innerText;
        input.className = "SmallFont";
        input.style.textAlign = "right";
        input.style.boxSizing = "border-box";
        input.style.width = getComputedStyle(DexButton).width;

        // 버튼 숨기기
        DexButton.style.display = "none";

        // 버튼 다음에 input 삽입
        DexButton.after(input);
        input.focus();

        function revertToButton() {
            DexButton.innerText = input.value; // 입력값 유지
            Var.dex = input.value;
            Func.UnitTotalStun();
            CountOn();
            input.remove(); // input 삭제
            DexButton.style.display = ""; // 버튼 다시 표시
        }

        input.addEventListener("blur", revertToButton);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                this.blur();
            }
        });
    });
}

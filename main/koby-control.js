import { ButtonColor } from "./button-style.js";
import { Var, Func } from "../import.js";
import { CountOn } from "./refresh.js";

export function createKobyControl(bar) {
    const Koby = document.createElement("div");
    Koby.className = "Button SmallFont";
    Koby.innerText = "코비";
    Koby.style.alignContent = "center";
    Koby.style.textAlign = "center";

    bar.appendChild(Koby);

    const KobyButton = document.createElement("div");
    KobyButton.className = "Button SmallFont";
    KobyButton.innerText = "0";
    KobyButton.style.paddingRight = "0.25vw";
    KobyButton.style.alignContent = "center";
    KobyButton.style.textAlign = "right";

    ButtonColor(KobyButton);
    bar.appendChild(KobyButton);

    // 버튼을 클릭하면 input으로 변환
    KobyButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = KobyButton.innerText;
        input.className = "SmallFont";
        input.style.textAlign = "right";
        input.style.boxSizing = "border-box";
        input.style.width = getComputedStyle(KobyButton).width;

        // 버튼 숨기기
        KobyButton.style.display = "none";

        // 버튼 다음에 input 삽입
        KobyButton.after(input);
        input.focus();

        function revertToButton() {
            KobyButton.innerText = input.value; // 입력값 유지
            Var.koby = parseInt(input.value);
            Func.UnitTotalStun();
            CountOn();
            input.remove(); // input 삭제
            KobyButton.style.display = ""; // 버튼 다시 표시
        }

        input.addEventListener("blur", revertToButton);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                this.blur();
            }
        });
    });
}

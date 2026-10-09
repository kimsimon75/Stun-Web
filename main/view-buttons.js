import { openMoveSpeedPage, Var } from "../import.js";
import { CountOn } from "./refresh.js";
import { ButtonColor } from "./button-style.js";

export function createViewButtons() {
    const MoveSpeedPage = document.createElement("button");
    MoveSpeedPage.className = "Button MoveSpeedPage SmallFont";
    MoveSpeedPage.innerText = "발동 이감";
    MoveSpeedPage.style.gridArea = "1/4/2/5";

    MoveSpeedPage.addEventListener("click", () =>{
        openMoveSpeedPage();
    })

    const deviation = document.createElement("button");
    deviation.className = "Button Stun SmallFont";
    deviation.innerText = "스턴 편차";
    deviation.title = "10초 동안 확률형 스턴 가동률이 평균에서 흔들리는 크기(표준편차). ±값은 퍼센트포인트이며, 마나·소환·변신·공격 정지 등 별도 기믹은 제외한 근사 모델입니다.";
    deviation.style.gridArea = "1/3/2/4";

    deviation.addEventListener('click', () => {
        Var.deviationToggle = !Var.deviationToggle;
        CountOn();
    })

    ButtonColor(deviation);
    document.getElementsByClassName(`Stack4`)[0].appendChild(deviation);

    ButtonColor(MoveSpeedPage);
    document.getElementsByClassName(`Stack4`)[0].appendChild(MoveSpeedPage);
}

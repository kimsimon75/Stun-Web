import { Var } from "../import.js";

export function renderMovementSpeed({ itemList }) {
    for (let i = 0; i <= 6; i++) {
        const item = document.createElement("li");
        item.textContent = `Item ${i}`;
        item.style.padding = "0.5rem   0";
        item.style.borderBottom = "0.1rem solid #ddd";

        switch (i) {
            case 0:
                item.textContent = `수치 : ${Var.speedDebuff}%`
                break;
            case 1:
                item.textContent = `※이감 40%당 이속 155 감소`
                break;
            case 2:
                item.textContent = `※이감 1%당 이속 3.875 감소`
                break;
            case 3:
                item.textContent = `신 최대 이감 : 102%`
                break;
            case 4:
                item.textContent = `악몽 최대 이감 : 102%`;
                break;
            case 5:
                item.textContent = `몹 이동속도(신) : ${Var.m_god}`;
                break;
            case 6:
                item.textContent = `몹 이동속도(악몽) : ${Var.m_nightmare}`;
                break;
        }

        itemList.appendChild(item);
    }
}

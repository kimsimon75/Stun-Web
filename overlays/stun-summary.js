import { Var } from "../import.js";

export function renderStunSummary({ itemList }) {

    for (let i = 1; i <= 10; i++) {
        const item = document.createElement("li");
        item.textContent = ``;
        item.style.padding = "0.5rem 0";
        item.style.borderBottom = "0.1rem solid #ddd";
        let result = 0;
        switch (i) {
            case 1:
                item.textContent = `스턴 가동률 : ${((1 - Math.pow(Var.StunCalCulation, Var.totalStun)) * 100).toFixed(2)}%`;
                break;
            case 2:
                item.textContent = `스턴 샐 확률 : ${(Math.pow(Var.StunCalCulation, Var.totalStun) * 100).toFixed(2)}%`;
                break;
            case 3:
                result = Var.m_god * Math.pow(Var.StunCalCulation, Var.totalStun)
                result = result % 1 === 0 ? result.toString() : result.toFixed(3);

                item.textContent = `초당 몹 이동 거리(신 기준) : ${result}`;
                break;
            case 4:
                result = Var.round * Var.m_god * Math.pow(Var.StunCalCulation, Var.totalStun)
                result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                item.textContent = `${Var.round}초 후 몹 이동 거리(신 기준) : ${result}`;
                break;
            case 5:
                result = 14 * Var.m_god * Math.pow(Var.StunCalCulation, Var.totalStun)
                result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                item.textContent = `14초 후 몹 이동 거리(신 기준) : ${result}`;
                break;
            case 6:
                break;
            case 7:
                result = Var.m_nightmare * Math.pow(Var.StunCalCulation, Var.totalStun)
                result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                item.textContent = `초당 몹 이동 거리(악몽 기준) : ${result}`;
                break;
            case 8:
                result = Var.round * Var.m_nightmare * Math.pow(Var.StunCalCulation, Var.totalStun)
                result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                item.textContent = `${Var.round} 후 몹 이동 거리(악몽 기준) : ${result}`;
                break;
            case 9:
                result = 14 * Var.m_nightmare * Math.pow(Var.StunCalCulation, Var.totalStun)
                result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                item.textContent = `14초 후 몹 이동 거리(악몽 기준) : ${result}`;
                break;
            case 10:
                item.textContent = `최소 스턴 범위 : ${Var.Sort.length ? Var.Sort[0][2] : 0}`;
                break;
        }

        itemList.appendChild(item);
    }
}

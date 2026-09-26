
export function renderUptimeFormula({ itemList }) {
    for (let i = 0; i <= 9; i++) {
        const item = document.createElement("li");
        item.textContent = `Item ${i}`;
        item.style.padding = "0.5rem   0";
        item.style.borderBottom = "0.1rem solid #ddd";

        switch (i) {
            case 0:
                item.textContent = `X = 확률`
                break;
            case 1:
                item.textContent = `S = 지속시간`
                break;
            case 2:
                item.textContent = `T = 공격 주기`
                break;
            case 3:
                item.textContent = `n = 지속시간 동안 타격 횟수(자연수)`
                break;
            case 4:
                item.textContent = `일반 공식 : 1+(XS/T - nX -1)*(1-X)^n`;
                break;
            case 5:
                item.textContent = `아오키지 : 1+(XS/T - nX -1)*(1-X)^n * (1 - 3 / (1 / T / 0.125 * (1 - 0.125) ^ (25 / (1 + 1 / T * 마나리젠))(자연수) ) + 50 / (T + 마나리젠))(자연수) )`;
                break;
            case 6:
                item.textContent = `(니카 한정) X2 : 거인화 시에 스턴 확률`;
                break;
            case 7:
                item.textContent = `(니카 한정) T2 : 거인화 시에 공격 주기`;
                break;
            case 8:
                item.textContent = `(니카 한정) n2 : 거인화 시에 스턴동안 타격 횟수(자연수)`;
                break;
            case 9:
                item.textContent = `니카 : ((1 - (1 + (X2 * S1 * T2 - n2 * X2 - 1) * (1 - X2)^n2) * 4.25 / 거인화 주기 - (1 + (X1 * S1 * T - n1 * X1 - 1) * (1 - X1) ^ n1) * (거인화 주기 - 4.25) / 거인화 주기)) * (1 - 마나스턴 시간 / 마나 크기 * ((4.25 * t2 + (거인화 주기 - 4.25) * t) / 거인화 주기 + 마나리젠))`;
                break;
        }

        itemList.appendChild(item);
    }
}

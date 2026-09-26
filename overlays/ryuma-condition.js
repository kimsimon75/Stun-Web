
export function renderRyumaCondition({ overlayContent }) {
    overlayContent.style.margin = "auto";

    // 🔽 항상 표시될 armor 박스 생성
    const armorDisplay = document.createElement("div");
    let stack = false;
    let level = false;
    let boss = false;
    let royal = false;
    armorDisplay.className = "StunDocument BigFont";
    armorDisplay.style.marginTop = "1vw";

    const updateArmorDisplay = () => {
        const armor_remover = parseInt(document.getElementById("armor_remover").value) || 0;
        let armor = 181 + (level ? 10 : 0) + (boss ? 10 : 0);
        let damage = 100 / (100 + 2 * armor - armor_remover);

        if(armor_remover > armor)
        {
            damage = 1 - Math.pow(0.94, Math.min(armor_remover - armor,20));
        }
        armorDisplay.innerText = `필요한 공격력 증가 계수: ${Math.ceil(( (100000 / 1.05 / damage - (royal ? 25000 : 0)) / (234501 + (stack ? 100000 : 0)) - 1) * 100) }%`;
    };
    for (let i = 0; i < 5; i++) {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.alignItems = "flex-start";
        item.style.marginBottom = "0.5vw";

        let input;

        if (i >= 1) {
            input = document.createElement("input");
            input.type = "checkbox";
            input.id = "stack";
            input.className = "switch-input";

            const slider = document.createElement("span");
            slider.className = "slider";

            const label = document.createElement("label");
            label.className = "switch";
            label.appendChild(input);
            label.appendChild(slider);

            const title = document.createElement("div");
            title.style.fontSize = "1vw";
            item.appendChild(title);
            item.appendChild(label);

        switch(i) {
            case 1:
                input.id = "stack";
                title.innerText = "류영 700스택:";
                input.addEventListener("change", () => {
                    stack = input.checked;
                    updateArmorDisplay();
                });
                break;
            case 2:
                input.id = "level";
                title.innerText = "난이도:";

                const modeLabel = document.createElement("span");
                modeLabel.innerText = input.checked ? "악몽" : "신";
                modeLabel.style.fontSize = "0.8vw";
                modeLabel.style.marginLeft = "0.5vw"; // 간격 조정

                const wrapper = document.createElement("div");
                wrapper.style.display = "flex";
                wrapper.style.alignItems = "center";
                wrapper.appendChild(label);
                wrapper.appendChild(modeLabel);

                item.appendChild(title);
                item.appendChild(wrapper);

                input.addEventListener("change", () => {
                    level = input.checked;
                    modeLabel.innerText = input.checked ? "악몽" : "신"; // ✅ 텍스트 업데이트
                    updateArmorDisplay();
                });
                break;


            case 3:
                input.id = "boss";
                title.innerText = "보스 몬스터 여부:";
                input.addEventListener("change", () => {
                    boss = input.checked;
                    updateArmorDisplay();
                });
                break;
            case 4:
                input.id = "royal";
                title.innerText = "로얄로더 여부:";
                input.addEventListener("change", () => {
                    royal = input.checked;
                    updateArmorDisplay();
                });
                break;
        }
        } else {
            input = document.createElement("input");
            input.type = "number";
            input.id = "armor_remover";
            input.style.fontSize = "0.65vw";
            input.style.width = "90%";
            input.style.padding = "0.4vw";
            input.style.margin = "0.2vw 0.2vw";

            const label = document.createElement("div");
            label.innerText = "현재 방깍:";
            item.appendChild(label);
            item.appendChild(input);

            input.addEventListener("input", updateArmorDisplay);
        }

        overlayContent.appendChild(item);
    }

    // 🔽 최초 표시 초기화
    updateArmorDisplay();
    overlayContent.appendChild(armorDisplay);
}

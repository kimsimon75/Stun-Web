import {Var, Unit, Func} from "./import.js";

export function openOverlay(sortCount, unitCount) {
    if (document.getElementById("overlay")) return; // 이미 오버레이가 있으면 실행 안 함

    sortCount = Number(sortCount);
    unitCount = Number(unitCount);

    const u = Unit.getUnit(sortCount, unitCount);

    // 🔥 오버레이 생성
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.zIndex = 1000;
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    overlay.tabIndex = -1;
    if(sortCount !== 400 && unitCount !== 400 && sortCount !== 600 && unitCount !== 600 && sortCount !== 700 && unitCount !== 700)
        overlay.addEventListener("click", closeOverlay);

    const overlayContent = document.createElement("div");
    overlayContent.style.width = "22.5vw";
    overlayContent.style.height = "40vw";
    overlayContent.style.padding = "0.5rem";
    overlayContent.style.backgroundColor = "white";
    overlayContent.style.borderRadius = "5px";
    overlayContent.style.position = "relative";
    overlayContent.style.overflowY = "auto"; // 스크롤 가능

    overlayContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);

    if((sortCount !== 400 && unitCount !== 400) && (sortCount !== 600 && unitCount !== 600) && (sortCount !== 700 && unitCount !== 700))
        document.addEventListener("keydown", handleEnterKey); // 🔥 오버레이가 떴을 때만 이벤트 추가

    else

    overlayContent.addEventListener("keydown", (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault(); // 기본 스크롤 방지

            const inputs = overlayContent.querySelectorAll("input"); // overlay 내부 input 가져오기
            let currentIndex = Array.from(inputs).indexOf(document.activeElement); // 현재 포커스된 input 찾기

            if (currentIndex !== -1) {
                if (currentIndex < inputs.length - 1) {
                    // 다음 input으로 포커스 이동
                    inputs[currentIndex + 1].focus();
                } else {
                    // 마지막 input이면 "입력" 버튼 클릭
                    document.getElementsByClassName("StunButton")[0].click();
                }
            }
        }
    });
    
    setTimeout(() => {
        overlay.focus();
    }, 0);
    if((sortCount === 400 && unitCount === 400) || (sortCount === 600 && unitCount === 600) || (sortCount === 700 && unitCount === 700))
        {
            const closeButton = document.createElement("button");
            closeButton.innerText = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.background = "red";
            closeButton.style.color = "white";
            closeButton.style.border = "none";
            closeButton.style.padding = "5px 10px";
            closeButton.style.cursor = "pointer";
            closeButton.style.fontSize = "16px";
            closeButton.style.borderRadius = "5px";
            closeButton.onclick = () => document.body.removeChild(overlay);
        
            overlayContent.appendChild(closeButton);

            document.addEventListener("keydown", handleEscapeKey);
        }



    // 3. 콘텐츠 박스 상단에 타이틀 추가
    const title = document.createElement("h2");
    title.style.textAlign = "center";
    title.style.marginBottom = "1vh";

    if (sortCount == 100 && unitCount == 100) 
        title.textContent = `${Var.totalStun.toFixed(3)}스턴`;
    else if (sortCount == 200 && unitCount == 200)
        title.textContent = `가동률 공식`;
    else if (sortCount == 300 && unitCount == 300)
        title.textContent = "이동속도 감소";
    else if(sortCount == 400 && unitCount == 400)
        title.textContent = "스턴 계산기";
    else if(sortCount === 500 && unitCount === 500)
        title.innerHTML = "마나뻥 (62라 기준)<br>(65라 5초 시전)";
    else if(sortCount === 600 && unitCount === 600)
        title.innerHTML = "방어력에 따른 물리피해 계산";
    else if(sortCount === 700 && unitCount === 700)
        title.innerHTML = "류영 오니가르기 발동 조건";
    else if(sortCount === 800 && unitCount === 800)
        title.innerHTML = "단일 효율(막라 기준)";
    else if (sortCount < 0){
        
        let unitNumber = 0;
        for(let count = -1; count < unitCount; unitNumber++)
        {
            if(Unit.allUnits[unitNumber].slow1.type != "none" || Unit.allUnits[unitNumber].slow2.type != "none"){
                count++;}
        }
        unitNumber--;
        title.textContent = `${Unit.allUnits[unitNumber].name} (${(Unit.allUnits[unitNumber].rank)})`;
    }
    else
        title.textContent = `${u.name} (${Unit.idxToRank(sortCount)})`;

    overlayContent.appendChild(title);

    // 4. 목록 추가
    const itemList = document.createElement("ul");
    itemList.style.listStyleType = "none";
    itemList.style.padding = 0;
    if (sortCount == 100 && unitCount == 100) {

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
    else if (sortCount == 200 && unitCount == 200) {
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
    else if (sortCount == 300 && unitCount == 300)
    {
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
    else if(sortCount == 400 && unitCount == 400)
    {
        for(let i=0; i<=5;i++)
        {   overlayContent.style.margin = "auto";

            const item = document.createElement("div");

            const input = document.createElement("input");
            input.type = "number";
            input.style.fontSize = "0.65vw";
            input.style.width = "90%";
            input.style.padding = "0.4vw";
            input.style.margin = "0.2vw 0.2vw";

            switch(i)
            {
                case 0:            
                    item.textContent = "공격 주기: ";
                    input.id = "attack_speed";
                    break;
                case 1:
                    item.textContent = "공속 보너스 (%): ";
                    input.id = "attack_speed_bonus";
                    break;
                    case 2:
                        item.textContent = "스턴 1 확률 (%): ";
                        input.id = "stun1_prob";
                        break;
                    case 3:
                        item.textContent = "스턴 1 지속시간 (초): ";
                        input.id = "stun1_duration";
                        break;                
                        case 4:
                        item.textContent = "스턴 2 확률 (%): ";
                        input.id = "stun2_prob";
                        break;
                    case 5:
                        item.textContent = "스턴 2 지속시간 (초): ";
                        input.id = "stun2_duration";
                        break;
            }
            item.appendChild(input);
            overlayContent.appendChild(item);

        }
        
        const StunButton = document.createElement("button");
        StunButton.className = "StunButton BigFont";
        StunButton.innerText = "입  력";
        StunButton.style.width = "100%";
        StunButton.style.padding = "0.4vw";
        StunButton.style.marginTop = "0.4vw";

        ButtonColor(StunButton);


        StunButton.addEventListener("click", ()=>{
            document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));

           
            const attack_speed = parseFloat(document.getElementById("attack_speed").value);
            const attack_speed_bonus = parseFloat(document.getElementById("attack_speed_bonus").value);
            const t = attack_speed / Math.min(1 + Func.RoundX(attack_speed_bonus / 100, 3), 5);

            const bigOne = document.getElementById("stun1_duration").value > document.getElementById("stun2_duration").value ? true : false;

            let x1 = Func.RoundX(document.getElementById("stun1_prob").value / 100,3);
            const s1 = document.getElementById("stun1_duration").value;
            
            let x2 = Func.RoundX(document.getElementById("stun2_prob").value / 100,3);
            const s2 = document.getElementById("stun2_duration").value;

            x1 = bigOne ? x1 : (x1 - x1 * x2);
            x2 = !bigOne ? x2 : (x2 - x1 * x2);
            
            const degree1 = StunCalCulator(t, x1, s1, t);
            const degree2 = StunCalCulator(t, x2, s2, t);
            if(attack_speed===0 || attack_speed_bonus === 0 || x1 === 0 || s1 === 0)
                alert("잘못된 정보입니다.");
            else
            for(let i=0;i<=5;i++)
            {   
                const Stun = document.createElement("div");
                Stun.className = "StunDocument SmallFont"
                switch(i)
                {
                    case 0:
                        Stun.innerText = `공격 속도 : ${(1/t).toFixed(3)}`
                        break;
                    case 1:
                        Stun.innerText = `스턴 1 등급 : ${(Math.log(1-degree1) / Math.log(Var.StunCalCulation)).toFixed(3)} 스턴`
                        break;
                    case 2:
                        Stun.innerText = `스턴 1 가동률 : ${(degree1*100).toFixed(3)} %`
                        break;                    
                    case 3:
                        Stun.innerText = `스턴 2 등급 : ${(Math.log(1-degree2) / Math.log(Var.StunCalCulation)).toFixed(3)} 스턴`
                        break;
                    case 4:
                        Stun.innerText = `스턴 2 가동률 : ${(degree2*100).toFixed(3)} %`
                        break;
                    case 5:
                        Stun.innerText = `총 스턴 : ${(Math.log((1 - degree1) * (1 - degree2)) / Math.log(Var.StunCalCulation)).toFixed(3)} 스턴`
                        break;
                    case 6:
                        const doublePercentage = Func.RoundX(1 - (1 - x1) * (1 - x2), 10);
                        Stun.innerText = `총 편차 : ${(t / doublePercentage).toFixed(3)}초`
                        break;
                }
                overlayContent.appendChild(Stun);
            }
        })

        overlayContent.appendChild(StunButton);
    }
    else if(sortCount === 500 && unitCount === 500)
    {
        Unit.Mana.forEach((item,index) =>{
            const Grid = document.createElement("div");
            Grid.style.display = "grid";
            Grid.style.gridTemplateColumns = "1.5fr 1fr"

            itemList.appendChild(Grid);

            const UnitName = document.createElement("div");
            UnitName.className = "Button BigFont";
            UnitName.style.padding = "1rem";
            UnitName.style.borderRight = "none";
            if(index !== 0)
                UnitName.style.borderTop = "none";
            UnitName.innerText = item[0];

            Grid.appendChild(UnitName);

            const Time = document.createElement("div");
            Time.className = "Button unitSort BigFont";
            Time.style.padding = "1rem";
            if(index !== 0)
                Time.style.borderTop = "none";
            let AttackSpeedBuff = Func.RoundX((1 + item[2] + Var.speedBonusEx / 100) , 4); 

            if(item[1][0] === "초월함")
                AttackSpeedBuff += Math.round(Var.dex / 100 * 1000)/1000;
            let t = Func.RoundX(1 / item[3] * Math.min(AttackSpeedBuff, 5), 3);

            if(item[1][0] === "희귀함"
            || item[1][0] === "전설적인" 
            || item[1][0] === "히든" 
            || item[1][0] === "왜곡됨"
            || item[1][0] === "특별함")
            {
                const findIndex = Unit.allUnits.findIndex(items => items.name === "로얄로더")
                if(Unit.allUnits[findIndex].Check > 0)
                {
                    t = Func.RoundX(1 / item[3] * Math.min(AttackSpeedBuff - Unit.allUnits[findIndex].atkSpeedBuff / 100, 5), 3);
                }
            }   

            let unitManaRegen = Var.manaRegen + Func.Brave(Var.koby) + ((item[1][0] === "초월함") ? Var.intel * 0.08 : 0 );

            let Buffindex = Unit.allUnits.findIndex(items => {
                return (item[0] == items.name && Unit.idxToRank(item[1]) === items.rank);
            })

            t = Func.RoundX(t * 0.95,3);
            const plus = 5;
            const braveKoby = Func.Brave(Var.koby);

            function Cycle(int)
            {
                if(item[0]==="미호크")
                {
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + 2) ) / (t + unitManaRegen + braveKoby + 2) + item[5];
                    return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
                }
                else if(item[0] === "프랑키")
                {
                    const Franky = - (document.getElementsByClassName(`m${Buffindex}`)[0].checked ? Unit.allUnits[Buffindex].Var.manaRegen : 0);
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + Franky )) / (t + unitManaRegen + braveKoby + Franky) + item[5];
                    return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
                }
                else if (item[0] === "에넬")
                {
                    const enel = - (document.getElementsByClassName(`m${Buffindex}`)[0].checked ? Unit.allUnits[Buffindex].Var.manaRegen : 0);
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + enel )) / (t + unitManaRegen + braveKoby + enel) + item[5];
                    return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
                }
                else if (item[0] === "류마(400스택 이상)")
                {
                    const toki = Unit.allUnits.findIndex(items => {
                        return items.name === "토키";
                    })
                    if(Unit.allUnits[toki].Check > 0)
                    {
                        AttackSpeedBuff = Func.RoundX(1 + item[2] + 0.2 + Func.RoundX(Var.speedBonusEx / 100, 3), 3);
                        t = Func.RoundX(1 / item[3] * Math.min(AttackSpeedBuff, 5), 3);
                        t = Func.RoundX(t * 0.95, 3);
                    }
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby )) / (t + unitManaRegen + braveKoby) + item[5];
                    return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
                }

                let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby) ) / (t + unitManaRegen + braveKoby) + item[5];
                return cycle * Math.ceil(Var.round * 3 / cycle) - Var.round * int + plus;
            }


            let [c3, c4] = [Func.RoundX(Cycle(3), 3), Func.RoundX(Cycle(4), 3)];
            let time = c3 >= Var.round ? c4 : c3;
            Time.innerText = time.toFixed(0) + "초";
            Grid.appendChild(Time);
        })
    }
    else if(sortCount == 600 && unitCount == 600)
    {
        for(let i=0; i<3;i++)
        {   overlayContent.style.margin = "auto";

            const item = document.createElement("div");

            const input = document.createElement("input");
            input.type = "number";
            input.style.fontSize = "0.65vw";
            input.style.width = "90%";
            input.style.padding = "0.4vw";
            input.style.margin = "0.2vw 0.2vw";

            switch(i)
            {
                case 0:            
                    item.textContent = "유닛 방어력: ";
                    input.id = "unit_armor";
                    break;
                case 1:
                    item.textContent = "현재 방깍: ";
                    input.id = "current_armor_remover";
                    break;
                    case 2:
                        item.textContent = "추가될 방깍: ";
                        input.id = "next_armor_remover";
                        break;
            }
            item.appendChild(input);
            overlayContent.appendChild(item);

        }
        
        const armorButton = document.createElement("button");
        armorButton.className = "StunButton BigFont";
        armorButton.innerText = "입  력";
        armorButton.style.width = "100%";
        armorButton.style.padding = "0.4vw";
        armorButton.style.marginTop = "0.4vw";

        ButtonColor(armorButton);


        armorButton.addEventListener("click", ()=>{
            document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));

           
            const unit_armor = parseInt(document.getElementById("unit_armor").value);
            const current_armor_remover = parseInt(document.getElementById("current_armor_remover").value);

            const next_armor_remover = parseInt(document.getElementById("next_armor_remover").value);

            for(let i=0;i<7;i++)
            {   
                const armor = document.createElement("div");
                armor.className = "StunDocument BigFont"

                let current_damage = Func.RoundX(100/(100 + 2 * (unit_armor - current_armor_remover)), 20);
                let next_damage = Func.RoundX(100/ (100 + 2* (unit_armor - current_armor_remover - next_armor_remover)),20);
            if(current_armor_remover>unit_armor)
            {
                const effectiveDiff = Math.min(current_armor_remover - unit_armor, 20);
                current_damage = Func.RoundX(2 - Math.pow(0.94, effectiveDiff), 6); // 소수점 6자리 정도면 충분
            }
            if(current_armor_remover+next_armor_remover > unit_armor)
            {
                const effectiveDiff = Math.min(current_armor_remover + next_armor_remover - unit_armor, 20);
                next_damage = Func.RoundX(2 - Math.pow(0.94, effectiveDiff), 6); // 소수점 6자리 정도면 충분
            }

                switch(i)
                {
                    case 0:
                        armor.innerText = `방깍이 없을시 물리피해 계수: ${(100/(100 + 2 * unit_armor) * 100).toFixed(2)}%`
                        break;
                    case 1:
                        armor.innerText = `방깍 계산된 물리피해 계수: ${(current_damage*100).toFixed(2)}%`
                        break;
                    case 2:
                        armor.innerText = `방깍 계산된 물리피해 계수(짭플): ${(Math.pow(current_damage, 2)*100).toFixed(2)}%`
                        break;                    
                    case 3:
                        armor.innerText = `방깍 추가시 딜 증가 수치: ${((next_damage - current_damage) * 100).toFixed(2)}%`
                        break;
                    case 4:
                        armor.innerText = `방깍 추가시 딜 증가 수치(짭플): ${((Math.pow(next_damage,2) - Math.pow(current_damage,2))*100).toFixed(2)}%`
                        break;
                    case 5:
                        armor.innerText = `방깍 추가시 딜 증가율 ${((next_damage - current_damage) / current_damage).toFixed(2)}배`
                        break;
                    case 6:
                        armor.innerText = `방깍 추가시 딜 증가율(짭플): ${((Math.pow(next_damage, 2) - Math.pow(current_damage, 2)) / Math.pow(current_damage, 2)).toFixed(2)}배`
                        break;
                }
                overlayContent.appendChild(armor);
            }
        })

        overlayContent.appendChild(armorButton);
    }   
    else if (sortCount == 700 && unitCount == 700) {
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
        armorDisplay.innerText = `필요한 공격력 증가 계수: ${Math.ceil(( (120000 / 1.05 / damage - (royal ? 25000 : 0)) / (234501 + (stack ? 100000 : 0)) - 1) * 100) }%`;
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
    else if(sortCount == 800 && unitCount == 800)
    {
        Unit.Mono.forEach((item,index) =>{
            var t = 1 / item[3] * Math.min(Func.RoundX(1 + item[2] + (Var.speedBonusEx + Var.dex) / 100,3), 5);

        if(item[1][0] === "희귀함"
        || item[0] === "전설적인" 
        || item[0] === "히든" 
        || item[0] === "왜곡됨"
        || item[0] === "특별함")
        {
            const findIndex = Unit.allUnits.findIndex(items => items.name === "로얄로더")
            if(Unit.allUnits[findIndex].Check > 0)
            {
                t = item[3] / (1 + item[2]) * Math.min(Func.RoundX(1 + item[2] + (Var.speedBonusEx + Var.dex - Unit.allUnits[findIndex].atkSpeedBuff) / 100,3), 5);
            }
        }    

            const Grid = document.createElement("div");
            Grid.style.display = "grid";
            Grid.style.gridTemplateColumns = "1.5fr 1fr 1fr"

            itemList.appendChild(Grid);

            const UnitName = document.createElement("div");
            UnitName.className = "Button BigFont";
            UnitName.style.padding = "1rem";
            UnitName.style.borderRight = "none";
            if(index !== 0)
                UnitName.style.borderTop = "none";
            UnitName.innerText = item[0] + `(${Unit.idxToRank(item[1])})`;

            Grid.appendChild(UnitName);

            const first = document.createElement("div");
            first.className = "Button BigFont";
            first.style.padding = "1rem";
            first.style.borderRight = "none";
            if(index !== 0)
                first.style.borderTop = "none";

            first.innerText = Func.RoundX(Math.log(1 - item[5] * item[8]) / Math.log(1 - 0.75) * item[4] * t * 10 / 1.7, 3);   


            Grid.appendChild(first);

            
            const second = document.createElement("div");
            second.className = "Button BigFont";
            second.style.padding = "1rem";
            if(index !== 0)
                second.style.borderTop = "none";
            second.innerText = Func.RoundX(Math.log(1 - item[7] * item[8]) / Math.log(1 - 0.75) * item[6] * t * 10/ 1.7 , 3);

            Grid.appendChild(second);

        })
    }


    else if (sortCount == -1) {
        
        let unitNumber = 0;
        for(let count = -1; count < unitCount; unitNumber++)
        {
            if(Unit.allUnits[unitNumber].slow1.type != "none" || Unit.allUnits[unitNumber].slow2.type != "none"){
                count++;}
        }
        unitNumber--;

        
        const u = Unit.allUnits[unitNumber];
        const totalBonus = Func.RoundX(1 + u.atkSpeedBonus + Var.speedBonusEx / 100, 3);
        const t = 1 / u.attackCycle * Math.min(totalBonus, 5);

        var s = u.slow1.dur;
        var x = u.slow1.p;
        for (let i = 0; i < 5; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `이감 확률 : ${(x * 100).toFixed(3)}%`;
                    break;
                case 1:
                    item.textContent = `이감 지속시간 : ${s.toFixed(2)}초`;
                    break;
                case 2:
                    item.textContent = `이감 수치 : ${u.slow1.eff}%`
                    break;
                case 3:
                    item.textContent = `이감 발동률 : ${(u.SlowCalculate * 100).toFixed(2)}%`;
                    break;
                case 4:
                    item.textContent = `이감이 다시 잡히는 평균 시간 : ${(1 / t / x).toFixed(3)}초`
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (sortCount == -2) {
        
        let unitNumber = 0;
        for(let count = -1; count < unitCount; unitNumber++)
        {
            if(Unit.allUnits[unitNumber].slow1.type != "none" || Unit.allUnits[unitNumber].slow2.type != "none"){
                count++;}
        }
        unitNumber--;

        const u = Unit.allUnits[unitNumber];
        let t = 1 / u.attackCycle * (((1 + u.atkSpeedBonus +
                parseFloat((Var.speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
                (1 + u.atkSpeedBonus +
                    parseFloat((Var.speedBonusEx / 100).toFixed(3))));
        let s = u.slow2.dur;
        let x = u.slow2.p;
        for (let i = 0; i < 4; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `여진 확률 : ${(x * 100).toFixed(0)}%`;
                    break;
                case 1:
                    item.textContent = `여진 지속시간 : ${s.toFixed(2)}초`;
                    break;
                case 2:
                    item.textContent = `여진 수치 : ${u.slow2.eff}%`
                    break;
                case 3:
                    item.textContent = `여진 가동률 : ${(u.EarthCalculate * 100).toFixed(2)}%`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (u.name === "니카") {
        var x1 = u.stun1.p;
        var s1 = u.stun1.dur;
        const rawBonus = (Unit.getUnit(sortCount, unitCount).Check)
        ? (Var.speedBonusEx + Var.dex) - u.atkSpeedBuff
        : (Var.speedBonusEx + Var.dex);

        const bonus = Func.RoundX(1 + u.atkSpeedBonus + rawBonus / 100, 3);
        const bonus2 = Func.RoundX(bonus - 2.25, 3);

        let t = 1 / u.attackCycle * Math.min(bonus, 5);
        let t2 = 1 / u.attackCycle * Math.min(bonus2, 5);
        let unitHealthRegen = Var.healthRegen + Var.intel * 0.04 + Func.Brave(Var.koby);


        let time = (4.25 + ((115 - 4.25 * (t2 + (unitHealthRegen + Var.intel*0.04) + 0.25)) / (t + (unitHealthRegen + Var.intel*0.04) + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (t2 + (unitHealthRegen + Var.intel*0.04) + 0.25)) / (t + (unitHealthRegen + Var.intel*0.04) + 0.25)));
        let unitManaRegen = Var.manaRegen + Var.intel * 0.08 + Func.Brave(Var.koby);

        var maxMana = u.mana;
        var m_stun = u.manaDuration;
        var n1 = Math.floor(s1 * t);
        var n2 = Math.floor(s1 * t2);

        for (let i = 0; i <= 21; i++) {

            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `스턴 지수 : ${Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)}스턴`
                    break;
                case 1:
                    item.textContent = `스턴 가동률 : ${((1 - Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2)}%`
                    break;
                case 2:
                    item.textContent = `일반 모드 공속 : 초당${t.toFixed(3)}`
                    break;
                case 3:
                    item.textContent = `거인화 모드 공속 : 초당${t2.toFixed(3)}`
                    break;
                case 4:
                    item.textContent = `공속 보너스(자체 버프 포함) : ${(u.atkSpeedBonus + parseFloat(((Var.speedBonusEx + Var.dex) / 100).toFixed(3)) - ((Unit.getUnit(sortCount, unitCount).Check) ? parseFloat((u.atkSpeedBuff / 100).toFixed(3)) : 0)) * 100}%`;
                    break;
                case 5:
                    item.innerText = `공속 버프 : ${u.atkSpeedBuff}%`
                    break;
                case 6:
                    item.innerText = `스턴 지속시간 : ${s1}초 (거인화, 일반 동일)`;
                    break;
                case 7:
                    item.innerText = `스턴 범위 : ${u.stun1.r} (거인화, 일반 동일)`;
                    break;
                case 8:
                    item.innerText = `일반 모드 스턴 확률 : ${(x1 * 100).toFixed(2)}%`
                    break;
                case 9:
                    item.innerText = `일반 모드 스턴 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 10:
                    item.innerText = `일반 모드 스턴 가동률 : ${((1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) * 100).toFixed(2)}%`;
                    break;
                case 11:
                    item.innerText = `거인화 모드 스턴 확률 : ${(0.2 * 100).toFixed(2)}%`
                    break;
                case 12:
                    item.innerText = `거인화 모드 스턴 가동률 : ${((1 + (0.2 * s1 * t2 - n2 * 0.2 - 1) * Math.pow(1 - 0.2, n2)) * 100).toFixed(2)}%`;
                    break;
                case 13:
                    item.innerText = `거인화 모드 스턴 수치 : ${(Math.log(-(0.2 * s1 * t2 - n2 * 0.2 - 1) * Math.pow(1 - 0.2, n2)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 14:
                    item.innerText = `거인화 모드 지속시간 : 4.25초`;
                    break;
                case 15:
                    item.innerText = `거인화 모드 주기 : ${time.toFixed(2)}초`;
                    break;
                case 16:
                    item.innerText = `거인화 모드 비중 : ${(4.25 / time * 100).toFixed(2)}%`;
                    break;
                case 17:
                    item.innerText = `마나통 : ${maxMana}`;
                    break;
                case 18:
                    item.innerText = `마나 스턴 지속시간 : ${m_stun}초`;
                    break;
                case 19:
                    item.innerText = `마나 스턴 범위 : ${u.manaRange}`;
                    break;
                case 20:
                    item.innerText = `마나 스턴 가동률 : ${(m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + unitManaRegen) * 100).toFixed(2)}%`
                    break;
                case 21:
                    item.innerText = `마나 스턴 수치 : ${(Math.log(1 - (m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + unitManaRegen))) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`
                    break;
            }
            itemList.appendChild(item);
        }


    }
    else {
        let x1 = u.stun1.p;
        let x2 = (1 - u.stun1.p) * u.stun2.p;
        let s1 = u.stun1.dur;
        let s2 = u.stun2.dur;
        const bonus = Func.RoundX(1 + u.atkSpeedBonus + (Unit.getUnit(sortCount, unitCount).Check ? 0 : Var.speedBonusEx / 100), 3);
        let t = 1 / u.attackCycle * Math.min(bonus, 5);
        let unitManaRegen = Var.manaRegen + Func.Brave(Var.koby) + ((Unit.idxToRank(sortCount) === "초월함") ? Var.intel * 0.08 : 0) ;
        let unitHealthRegen = Var.healthRegen + Func.Brave(Var.koby) + ((Unit.idxToRank(sortCount) === "초월함") ? Var.intel * 0.04 : 0); 

        let maxMana = u.mana;
        let m_stun = u.manaDuration;
        let n1 = Math.floor(s1 * t);
        let n2 = Math.floor(s2 * t);

        for (let i = 1; i <= 22; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            if(u.stun1.type == "none" && i>= 6 && i <=10 )
                i = 12;

            if (u.stun2.type == "none" && i >= 12 && i <= 16)
                i = 18;
            if (maxMana == 0 && i >= 18 && i <= 22)
            {
                i = 22;
                continue;
            }
            switch (i) {
                case 1:
                    item.innerText = "스턴 지수 : " + Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
                    break;
                case 2:
                    item.innerText = "스턴 가동률 : " + ((1 - Math.pow(Var.StunCalCulation,Unit.getUnit(sortCount, unitCount).StunCalCulate))*100).toFixed(2) + "%";
                    break;
                case 3:
                    item.innerText = `공속 : 초당${t.toFixed(3)}`;
                    break;
                case 4:
                    const bonus = Func.RoundX(u.atkSpeedBonus + Var.speedBonusEx / 100 - (Unit.getUnit(sortCount, unitCount).Check ? u.atkSpeedBuff / 100 : 0), 3);
                    item.innerText = `공속 보너스(자체 버프 포함) : ${(bonus * 100).toFixed(2)}%`;

                    break;
                case 5:
                    item.innerText = `공속 버프 : ${u.atkSpeedBuff}%`
                    break;
                case 6:
                    if(Unit.idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아") item.innerText = `스턴 1 쿨타임 : ${x1}초`;
                    else item.innerText = `스턴 1 확률 : ${(x1 * 100).toFixed(2)}%`
                    break;
                case 7:
                    item.innerText = `스턴 1 지속시간 : ${s1}초`;
                    break;
                case 8:
                    item.innerText = `스턴 1 범위 : ${u.stun1.r}`;
                    break;
                case 9:
                    if (u.name == "루피") {
                        let n3 = Math.ceil(1.75 * t);
                        let time = n3 / t;
                        let n4 = Math.floor((2.75 - time) * t);
                        item.innerText = `스턴 1 수치 : ${(Math.log(1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                    }
                    else if(Unit.idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아")
                    {
                        item.innerText = `스턴 1 수치 : ${Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)} 스턴`
                    }
                    else if (u.name == "라분") {
                        item.innerText = `스턴 1 수치 : ${Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)}스턴`;
                    }
                    else
                        item.innerText = `스턴 1 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 10:
                    if (u.name == "라분" || (Unit.idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아")) {
                        item.innerText = `스턴 1 샐 확률 : ${(Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)*100).toFixed(2)}%`;
                    }
                    else if (u.name == "루피")
                    {
                        let n3 = Math.ceil(1.75 * t);
                        let time = n3 / t;
                        let n4 = Math.floor((2.75 - time) * t);
                        item.innerText = `스턴 1 샐 확률 : ${((1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) * 100).toFixed(2)}%`
                    }
                    else
                        item.innerText = `스턴 1 샐 확률 : ${(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * 100).toFixed(2)}%`;
                    break;
                case 11:
                    if (u.name == "라분") {
                        let count = 0;
                        let time1 = 0.65 + 0 / t - 2.15;
                        if (time1 > 0)
                            count++;
                        else
                            time1 = 0;

                        let time2 = 0.65 + 1 / t - 2.15;
                        if (time2 > 0)
                            count++;
                        else
                            time2 = 0;

                        let time3 = 0.65 + 2 / t - 2.15;
                        if (time3 > 0)
                            count++;
                        else
                            time3 = 0;

                        let time4 = 0.65 + 3 / t - 2.15;
                        if (time4 > 0)
                            count++;
                        else
                            time4 = 0;

                        let time5 = 0.65 + 4 / t - 2.15;
                        if (time5 > 0)
                            count++;
                        else
                            time5 = 0;

                        let time6 = 0.65 + 5 / t - 2.15;
                        if (time6 > 0)
                            count++;
                        else
                            time6 = 0;

                        let time7 = 0.65 + 5 / t - 2.15;
                        if (time7 > 0)
                            count++;
                        else
                            time7 = 0;
                        item.innerText = `스턴 1 편차 : ${((
                            time1 * x1 * Math.pow(1 - x1, count - 7) + 
                            time2 * x1 * Math.pow(1 - x1, count - 6) + 
                            time3 * x1 * Math.pow(1 - x1, count - 5) + 
                            time4 * x1 * Math.pow(1 - x1, count - 4) + 
                            time5 * x1 * Math.pow(1 - x1, count - 3) + 
                            time6 * x1 * Math.pow(1 - x1, count - 2) + 
                            time7 * (
                                1 - 
                                x1 - 
                                x1 * (1 - x1) - 
                                x1 * Math.pow(1 - x1, 2) - 
                                x1 * Math.pow(1 - x1, 3) - 
                                x1 * Math.pow(1 - x1, 4) - 
                                x1 * Math.pow(1 - x1, 5)))).toFixed(3)}초`;
                    }
                    else if (u.UnitName == "루피") {
                        item.innerText = `스턴 1 편차 : ${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                    }
                    else
                        item.innerText = `스턴 1 편차 : ${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                    break;
                case 12:
                    item.innerText = `스턴 2 확률 : ${(u.stun2.p * 100).toFixed(2)}%`
                    break;
                case 13:
                    item.innerText = `스턴 2 지속시간 : ${s2}초`;
                    break;
                case 14:
                    item.innerText = `스턴 2 범위 : ${u.stun2.r}`;
                    break;
                case 15:
                    item.innerText = `스턴 2 수치 : ${(Math.log(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(Var.StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 16:
                    item.innerText = `스턴 2 샐 확률 : ${(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * 100).toFixed(2)}%`;
                    break;
                case 17:
                    item.innerText = `스턴 2 편차 : ${((n2 + 1 + 1 / x2) / t - s2).toFixed(3)}초`;
                    break;
                case 18:
                    item.innerText = `마나(체력) 통 : ${maxMana}`;
                    break;
                case 19:
                    item.innerText = `마나(체력)스턴 지속시간 : ${m_stun}초`;
                    break;
                case 20:
                    item.innerText = `마나(체력)스턴 범위 : ${u.manaRange}`;
                    break;
                case 21:
                    item.innerText = `마나(체력)스턴 수치 : `;
                    if (u.name === "샹크스" && Unit.idxToRank(sortCount) == '초월함') {
                        item.innerText += (Math.log((1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35)) / Math.log(Var.StunCalCulation)).toFixed(3);
                    }
                    else if (u.name === "아오키지" && Unit.idxToRank(sortCount) == '초월함') {
                        item.innerText += (Math.log(1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, floor(25 / (1 + 1 / t * unitManaRegen))) + 50 / (t + unitManaRegen))) / Math.log(Var.StunCalCulation)).toFixed(3);
                    }
                    else if (u.name === "흰수염") {
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (t + unitHealthRegen + 0.5))) / Math.log(Var.StunCalCulation)).toFixed(3);
                    }                    
                    else if (u.name === "키드" && Unit.idxToRank(sortCount) == '초월함') {
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (t + unitHealthRegen + 0.2))) / Math.log(Var.StunCalCulation)).toFixed(3);
                    }
                    else if (maxMana)
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (unitManaRegen + t))) / Math.log(Var.StunCalCulation)).toFixed(3);
                    else
                        item.innerText += 0;
                    item.innerText += '스턴';
                    break;
                case 22:
                    item.innerText = `마나(체력)스턴 공백 :`;
                    if (u.name === "샹크스" && Unit.idxToRank(sortCount) == '초월함') {
                        item.innerText += ((1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35) * 100).toFixed(2);
                    }
                    else if (u.name === "아오키지" && Unit.idxToRank(sortCount) == '초월함') {
                        item.innerText += ((1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * unitManaRegen))) + 50 / (t + unitManaRegen))) * 100).toFixed(2);
                    }
                    else if (u.name === "흰수염") {
                        item.innerText += ((1 - ((maxMana != 0) ? m_stun / (maxMana / (t + unitHealthRegen + 0.5)) : 0)) * 100).toFixed(2);
                    }                    
                    else if (u.name === "키드" && Unit.idxToRank(sortCount) == '초월함') {
                        item.innerText += (( 1 - m_stun / (maxMana / (t + unitHealthRegen + 0.2))) * 100).toFixed(2);
                    }
                    else if (maxMana)
                        item.innerText += ((1 - m_stun / (maxMana / (unitManaRegen + t))) * 100).toFixed(2);
                    else
                        item.innerText = 0;
                    item.innerText += `%`;
                    break;

                }
  
                itemList.appendChild(item);
            }}
    overlayContent.appendChild(itemList);

    overlay.appendChild(overlayContent);

    // 7. 오버레이를 body에 추가
    document.body.appendChild(overlay);
}


export function closeOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleEnterKey); // 🔥 이벤트 제거
        document.removeEventListener("keydown", handleEscapeKey);
    }
}

// ✅ 엔터 키 이벤트 핸들러
export function handleEnterKey(event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
        closeOverlay(); // 엔터를 누르면 오버레이 닫기
    }
}

export function handleEscapeKey(event) {
    if (event.code === "Escape") closeOverlay();
}

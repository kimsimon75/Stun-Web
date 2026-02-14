
import {Unit, Var, Func, openMoveSpeedPage, Overlay, StunView} from "./import.js";

const container = document.getElementsByClassName("container")[0];

window.container = container;

document.getElementsByClassName("container")[0].style.gridTemplateRows = `repeat(${Var.containerGrid}, 1fr)`;



Func.UnitTotalStun();
// unitStat(객체) -> 모든 유닛을 1차원 배열로 합치면서 rank 붙이기


window.CountOn = () => {

    Var.m_god = Math.max(Math.min(Func.RoundX(484 - 3.875*Var.speedDebuff, 3), Var.max_move), Var.min_move);
    Var.m_nightmare = Math.max(Math.min(Func.RoundX(484 - 3.875*Var.speedDebuff, 3), Var.max_move), Var.min_move);


    if (document.getElementById("container1") != null)
    {
        Var.totalStun = 0;
        for (let sortCount = 0; sortCount < Object.keys(Unit.unitStat).length; sortCount++) {
        for (let unitCount = 0; unitCount < Unit.unitStat[Unit.idxToRank(sortCount)].length; unitCount++) {
            if(Unit.getUnit(sortCount, unitCount).stun1.type == "none" && Unit.getUnit(sortCount, unitCount).manaRange == 0) continue;
            const rate = document.getElementById(`r-${sortCount}-${unitCount}`);
            if(Var.deviationToggle == false)
                rate.innerText = Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
            else
                {
                    const u = Unit.getUnit(sortCount, unitCount);
                    
                    if(u.stun1.type == "none"){
                        rate.innerText = "측정 불가";
                        continue;
                    }
                    let x1 = u.stun1.p;
                    let s1 = u.stun1.dur;
                    const bonus = Func.RoundX(1 + u.atkSpeedBonus + (Unit.getUnit(sortCount, unitCount).Check ? 0 : Var.speedBonusEx / 100), 3);
                    let t = 1 / u.attackCycle * Math.min(bonus, 5);
                    if(u.stun2.type != "none"){
                        x1 = 1 - (1- x1) * (1 - u.stun2.p);
                        rate.innerText = `${Func.RoundX(1 / t / x1, 3)}초`;
                        continue;
                    }
                    var n1 = Math.floor(s1 * t);
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
                        rate.innerText = `${((
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
                        rate.innerText = `${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                    }
                    else
                        rate.innerText = `${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                } 

            const percentage = document.getElementById(`per-${sortCount}-${unitCount}`);
            percentage.innerText = ((1 - Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2) + "%";

            const Count = document.getElementById(`c-${sortCount}-${unitCount}`);
            const u = Unit.getUnit(sortCount, unitCount);
            const CheckU = Unit.allUnits.find(items => items.name == u.name && items.rank == u.rank);
            Count.innerText = CheckU.Check;

            Var.totalStun += (CheckU.Check > 0) ? Unit.getUnit(sortCount, unitCount).StunCalCulate * CheckU.Check : 0;
        }
        }
    }
    if (document.getElementById("container2") != null) {
        let field = 0;
        for (let unitCount = 0; unitCount < Unit.allUnits.length;field++, unitCount++) {
            const u = Unit.allUnits[unitCount];

            if(u.EarthCalculate == 0 && u.SlowCalculate == 0)
            {
                field--;
                continue;
            }

            const AfterShockRate = document.getElementById(`a-${field}`);
            AfterShockRate.innerText = (u.EarthCalculate * 100).toFixed(2) + "%";

            const MoveSpeedRate = document.getElementById(`m-${field}`);
            MoveSpeedRate.innerText = (u.SlowCalculate * 100).toFixed(2) + "%";

            const unitName = document.getElementById(`n-${field}`);
            unitName.innerText = u.name;

            const unitSort = document.getElementById(`s-${field}`);
            unitSort.innerText = u.rank;
        }
        for (let i = 0; i < document.getElementsByClassName("UnitNameBar").length; i++) {

            document.getElementsByClassName("UnitNameBar")[i].textContent = (Var.nameSort == 0) ? "유닛명" : (Var.nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
            document.getElementsByClassName("UnitSortBar")[i].textContent = (Var.rateSort == 0) ? "등급" : (Var.rateSort == -1) ? "등급 ⬇" : "등급 ⬆";
            document.getElementsByClassName("MoveSpeedBar")[i].textContent = (Var.moveSpeedSort == 0) ? "이감 발동률" : (Var.moveSpeedSort == -1) ? "이감 발동률 ⬇" : "이감 발동률 ⬆";
            document.getElementsByClassName("AfterShockBar")[i].textContent = (Var.afterShockSort == 0) ? "여진 가동률" : (Var.afterShockSort == -1) ? "여진 가동률 ⬇" : "여진 가동률 ⬆";
        }
    }

    Func.SetElemental();
}

function ClearAll() {
    Var.speedBonusEx = 0;
    Var.totalStun = 0;
    Var.manaRegen = 0;
    Var.healthRegen = 0;
    Var.speedDebuff = 0;


    if (document.getElementById("container1") != null)
        for (var sortCount = 0; sortCount < Unit.unitStat.length; sortCount++) {
            for (var unitCount = 1; unitCount < Unit.unitStat[sortCount].length; unitCount++) {
                Unit.getUnit(sortCount, unitCount).Check = 0;
                document.getElementById(`c-${sortCount}-${unitCount}`).innerText = "0";
            }
        }

    Unit.allUnits.forEach((item) => {
        item.Check = 0;
    })

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    })

    Func.UnitTotalStun();
    CountOn();
}


// slow1/slow2에서 "수치" 뽑기 (네 SLOW 구조에 맞춰 r 우선)
function slowValue(slowObj) {
  if (!slowObj) return 0;
  if (slowObj.type === "none") return 0;
  return slowObj.eff ?? slowObj.value ?? 0; // r이 없으면 value 같은거 대비
}



function BuffAdd(checked, item) //이중 계산 방지 speedBonusEx는 제외
{
    Var.speedBonusEx += checked ? item.atkSpeedBuff : -item.atkSpeedBuff;
    Var.manaRegen += checked ? item.manaRegen : -item.manaRegen;
    Var.healthRegen += checked ? item.healthRegen : -item.healthRegen;
    Var.speedDebuff += checked ? item.slow : -item.slow;
    item.Check = checked ? 1 : 0;
}


window.Collect = function(item, index)
{
    const ClassN = [`s${index}`, `m${index}`, `h${index}`, `d${index}`]
    const items = [];
    items[0] = item.atkSpeedBuff;
    items[1] = item.manaRegen;
    items[2] = item.healthRegen;
    items[3] = item.slow;

    for(let i=0;i<=3;i++)
    {
        if(items[i] != 0)
        {
            if(document.getElementById("container2") !== null)
            {
                document.getElementsByClassName(ClassN[i])[1].checked = item.Check;    
            }
            document.getElementsByClassName(ClassN[i])[0].checked = item.Check;
        }
    }        
}

function CheckEvent(CheckEl, item, fallbackIndex) {
  CheckEl.addEventListener("change", (event) => {
    const checked = event.target.checked === true;

    const findAllUnitIndex = (name, rank) =>
      Unit.allUnits.findIndex(u => u.name === name && u.rank === rank);

    // item이 속한 Rate 그룹 찾기
    const groupIndex = Unit.Rate.findIndex(group =>
      group.some(([name, rank]) => name === item.name && rank === item.rank)
    );

    // 그룹 아니면 그냥 on/off
    if (groupIndex === -1) {
      item.Check = checked ? 1 : 0;
      BuffAdd(checked, item);

      const idx = Unit.allUnits.findIndex(u => u === item);
      Collect(item, idx !== -1 ? idx : fallbackIndex);

      Func.UnitTotalStun();
      CountOn();
      return;
    }

    const group = Unit.Rate[groupIndex];
    const row = group.findIndex(([name, rank]) => name === item.name && rank === item.rank);
    if (row === -1) return;

    // 현재 활성(버프 적용) 항목 찾기 (가장 높은 티어)
    const getActiveRow = () => {
      for (let i = group.length - 1; i >= 0; i--) {
        const [n, r] = group[i];
        const idx = findAllUnitIndex(n, r);
        if (idx !== -1 && !!Unit.allUnits[idx].Check) return i;
      }
      return -1;
    };

    const oldActiveRow = getActiveRow();

    // ✅ 핵심: 체크/해제에 따른 그룹 Check 상태 재설정
    // checked  : i <= row  => 1, i > row  => 0
    // unchecked: i <  row  => 1 유지, i >= row => 0 (즉, 하위 끄면 상위도 꺼짐)
    for (let i = 0; i < group.length; i++) {
      const [name, rank] = group[i];
      const idx = findAllUnitIndex(name, rank);
      if (idx === -1) continue;

      const desired = checked ? (i <= row ? 1 : 0)
                             : (i <  row ? 1 : 0);

      const prev = Unit.allUnits[idx].Check ? 1 : 0;
      Unit.allUnits[idx].Check = desired;

      // UI 동기화는 무조건 해주는 게 안전(인덱스/정렬 문제 방지)
      Collect(Unit.allUnits[idx], idx);
    }

    const newActiveRow = getActiveRow();

    // 버프는 “활성 1개만”
    if (oldActiveRow !== newActiveRow) {
      if (oldActiveRow !== -1) {
        const [oldName, oldRank] = group[oldActiveRow];
        const oldIdx = findAllUnitIndex(oldName, oldRank);
        if (oldIdx !== -1) BuffAdd(false, Unit.allUnits[oldIdx]);
      }
      if (newActiveRow !== -1) {
        const [newName, newRank] = group[newActiveRow];
        const newIdx = findAllUnitIndex(newName, newRank);
        if (newIdx !== -1) BuffAdd(true, Unit.allUnits[newIdx]);
      }
    }

    Func.UnitTotalStun();
    CountOn();
  });
}

window.ButtonColor = function (name) {
    name.style.background = "rgb(235, 235, 235)";

    name.addEventListener('mouseenter', () => {
        name.style.background = "rgb(215, 215, 215)";
    });

    name.addEventListener('mouseleave', () => {
        name.style.background ="rgb(235, 235, 235)";
    });

    name.addEventListener('mousedown', () => {
        name.style.background = "rgb(250, 250, 250)";
    });

    name.addEventListener('mouseup', () => {
        name.style.background = "rgb(225, 225, 225)";
    });
}

function separateKorean(text) {
    const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
    const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
    const JONG = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

    let result = "";
    
    for (let char of text) {
        const code = char.charCodeAt(0) - 44032;
        
        if (code < 0 || code > 11171) {
            result += char; // 한글이 아니면 그대로 추가
            continue;
        }
        
        const cho = CHO[Math.floor(code / 588)];
        const jung = JUNG[Math.floor((code % 588) / 28)];
        const jong = JONG[(code % 28) - 1] || ""; // 받침이 없으면 빈 문자열

        result += cho + jung + jong; // 초성 + 중성 + 종성 합쳐서 저장
    }
    
    return result;
}


window.Stack = function() {

    for (let i = 0; i <= 5; i++) {
        const Stack = document.createElement("div");
        Stack.className = `Stack${i}`
        Stack.style.display = "grid";   
        Stack.style.gridArea = ` ${Var.containerGrid - i} / 3 /  ${Var.containerGrid + 1 - i} / 4`;

        document.getElementsByClassName("container")[0].appendChild(Stack);

        if (i === 0)
            Stack.style.gridTemplateColumns = "6fr 4fr";
        else
            Stack.style.gridTemplateColumns = "repeat(4, 1fr)";
    }
    


    const TotalStun = document.createElement("div");
    TotalStun.className = 'Button TotalStun SmallFont';
    TotalStun.addEventListener('click', () => {
        Overlay.openOverlay(100, 100);
    });
    TotalStun.innerText = `${Var.totalStun.toFixed(3)}스턴`;
    ButtonColor(TotalStun);

    document.getElementsByClassName(`Stack0`)[0].appendChild(TotalStun);


    const clear = document.createElement("div");
    clear.className = "Button clear SmallFont";
    clear.innerText = '초기화';
    clear.addEventListener("click", ()=>{
        location.reload();
    });
    ButtonColor(clear);

    document.getElementsByClassName(`Stack0`)[0].appendChild(clear);

    const DebuffOverlay = document.createElement("div");
    DebuffOverlay.className = "DebuffOverlay";
    DebuffOverlay.style.position = "fixed";
    DebuffOverlay.style.top = 0;
    DebuffOverlay.style.left = 0;
    DebuffOverlay.style.width = "100%";
    DebuffOverlay.style.height = "100%";
    DebuffOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    DebuffOverlay.style.zIndex = 1000;
    DebuffOverlay.style.display = "flex";
    DebuffOverlay.style.justifyContent = "center";
    DebuffOverlay.style.alignItems = "center";
    DebuffOverlay.style.visibility = "hidden";

    DebuffOverlay.addEventListener("click", () => {
        DebuffOverlay.style.visibility = (DebuffOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        DebuffScroll.style.visibility = (DebuffScroll.style.visibility === "hidden") ? "visible" : "hidden";

        DebuffspeedBonusExSearchBar.querySelector("input").value = ""; 

        // 모든 항목 다시 보이게 설정
        let items = document.querySelectorAll(".CheckBox-Stack");
        items.forEach(item => {
            item.style.display = "flex"; // 모든 항목을 표시
        });
    });

    document.body.appendChild(DebuffOverlay);

// ✅ 1️⃣ 스크롤 가능한 컨테이너(`DebuffScroll`) 동적 생성
    const DebuffScroll = document.createElement("div");
    DebuffScroll.className = "SmallFont";
    DebuffScroll.style.position = "absolute";
    DebuffScroll.style.height = "60vh";
    DebuffScroll.style.overflowY = "auto";  // 스크롤 가능하게 설정
    DebuffScroll.style.background = "white";
    DebuffScroll.style.border = "0.05rem solid #ccc";
    DebuffScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";


    // ✅ 2️⃣ 검색창(`DebuffspeedBonusExSearchBar`)을 `DebuffScroll` 안에 동적으로 추가
    const DebuffspeedBonusExSearchBar = document.createElement("div");
    DebuffspeedBonusExSearchBar.className = "search-bar";
    DebuffspeedBonusExSearchBar.style.position = "sticky"; // ✅ 스크롤해도 고정되게 설정
    DebuffspeedBonusExSearchBar.style.zIndex = 1000;
    DebuffspeedBonusExSearchBar.style.top = "0";
    DebuffspeedBonusExSearchBar.style.left = "0";
    DebuffspeedBonusExSearchBar.style.width = "100%";
    DebuffspeedBonusExSearchBar.style.background = "white";
    DebuffspeedBonusExSearchBar.style.padding = "10px";
    DebuffspeedBonusExSearchBar.style.borderBottom = "1px solid #ccc";
    DebuffspeedBonusExSearchBar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    DebuffspeedBonusExSearchBar.innerHTML = `<input type="text" placeholder="검색어 입력..." style="width: 80%; padding: 8px;">`;

    DebuffspeedBonusExSearchBar.querySelector("input").addEventListener("input", function () {
        let query = this.value.trim().toLowerCase(); // 검색어를 공백을 제외한 소문자로 변환
        query = separateKorean(query); // 검색어 한글 분리
    
        let items = document.querySelectorAll(".CheckBox-Stack");
    
        if (query === "") {
            items.forEach(item => {
                item.style.display = "flex"; // 검색어가 없으면 모든 항목 표시
            });
        } else {
            items.forEach(item => {
                let text = item.innerText.toLowerCase(); // 텍스트 가져오기
                let separatedText = separateKorean(text); // 리스트 항목도 한글 분리
    
                if (separatedText.includes(query)) {
                    item.style.display = "flex"; // 검색어가 포함되면 표시
                } else {
                    item.style.display = "none"; // 검색어가 없으면 숨김
                }
            });
        }
    });

// ✅ 3️⃣ `DebuffScroll`에 `DebuffspeedBonusExSearchBar` 추가 + `body`에 추가
    DebuffScroll.appendChild(DebuffspeedBonusExSearchBar);  // 검색창을 스크롤 박스 안에 추가

// ✅ 4️⃣ `scroll` 이벤트 필요 없음 (CSS `sticky` 사용)

    
    // ✅ 클릭 이벤트 방지 (필요하면 유지)
    DebuffScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    

    const SpeedBonusExButton = document.createElement("div");
    SpeedBonusExButton.className = "AttackSpeedEx Button SmallFont";
    SpeedBonusExButton.innerText = `${Var.speedBonusEx}%`;
    SpeedBonusExButton.style.textAlign = "right";
    SpeedBonusExButton.style.alignContent = "center";
    SpeedBonusExButton.style.paddingRight = "0.25vw";
    ButtonColor(SpeedBonusExButton);
    

    const SpeedBonusExOverlay = document.createElement("div");
    SpeedBonusExOverlay.className = "SpeedBonusExOverlay";
    SpeedBonusExOverlay.style.position = "fixed";
    SpeedBonusExOverlay.style.top = 0;
    SpeedBonusExOverlay.style.left = 0;
    SpeedBonusExOverlay.style.width = "100%";
    SpeedBonusExOverlay.style.height = "100%";
    SpeedBonusExOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    SpeedBonusExOverlay.style.zIndex = 1000;
    SpeedBonusExOverlay.style.display = "flex";
    SpeedBonusExOverlay.style.justifyContent = "center";
    SpeedBonusExOverlay.style.alignItems = "center";
    SpeedBonusExOverlay.style.visibility = "hidden";

    SpeedBonusExOverlay.addEventListener("click", () => {
        SpeedBonusExOverlay.style.visibility = (SpeedBonusExOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        speedBonusExScroll.style.visibility = (speedBonusExScroll.style.visibility === "hidden") ? "visible" : "hidden";

        speedBonusExSearchBar.querySelector("input").value = ""; 

        // 모든 항목 다시 보이게 설정
        let items = document.querySelectorAll(".CheckBox-Stack");
        items.forEach(item => {
            item.style.display = "flex"; // 모든 항목을 표시
        });
        
       });

    document.body.appendChild(SpeedBonusExOverlay);

    const speedBonusExScroll = document.createElement("div");
    speedBonusExScroll.className = "SmallFont";
    speedBonusExScroll.style.position = "absolute";
    speedBonusExScroll.style.height = "60vh";
    speedBonusExScroll.style.overflowY = "auto";
    speedBonusExScroll.style.background = "white";
    speedBonusExScroll.style.border = "0.05rem solid #ccc";
    speedBonusExScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

    speedBonusExScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const speedBonusExSearchBar = document.createElement("div");
    speedBonusExSearchBar.className = "search-bar";
    speedBonusExSearchBar.style.position = "sticky"; // ✅ 스크롤해도 고정되게 설정
    speedBonusExSearchBar.style.zIndex = 1000;
    speedBonusExSearchBar.style.top = "0";
    speedBonusExSearchBar.style.left = "0";
    speedBonusExSearchBar.style.width = "100%";
    speedBonusExSearchBar.style.background = "white";
    speedBonusExSearchBar.style.padding = "10px";
    speedBonusExSearchBar.style.borderBottom = "1px solid #ccc";
    speedBonusExSearchBar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    speedBonusExSearchBar.innerHTML = `<input type="text" placeholder="검색어 입력..." style="width: 80%; padding: 8px;">`;

    speedBonusExSearchBar.querySelector("input").addEventListener("input", function () {
        let query = this.value.trim().toLowerCase(); // 검색어를 공백을 제외한 소문자로 변환
        query = separateKorean(query); // 검색어 한글 분리
    
        let items = document.querySelectorAll(".CheckBox-Stack");
    
        if (query === "") {
            items.forEach(item => {
                item.style.display = "flex"; // 검색어가 없으면 모든 항목 표시
            });
        } else {
            items.forEach(item => {
                let text = item.innerText.toLowerCase(); // 텍스트 가져오기
                let separatedText = separateKorean(text); // 리스트 항목도 한글 분리
    
                if (separatedText.includes(query)) {
                    item.style.display = "flex"; // 검색어가 포함되면 표시
                } else {
                    item.style.display = "none"; // 검색어가 없으면 숨김
                }
            });
        }
    });
    speedBonusExScroll.appendChild(speedBonusExSearchBar);  // 검색창을 스크롤 박스 안에 추가

    const MRegenOverlay = document.createElement("div");
    MRegenOverlay.className = "MRegenOverlay";
    MRegenOverlay.style.position = "fixed";
    MRegenOverlay.style.top = 0;
    MRegenOverlay.style.left = 0;
    MRegenOverlay.style.width = "100%";
    MRegenOverlay.style.height = "100%";
    MRegenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    MRegenOverlay.style.zIndex = 1000;
    MRegenOverlay.style.display = "flex";
    MRegenOverlay.style.justifyContent = "center";
    MRegenOverlay.style.alignItems = "center";
    MRegenOverlay.style.visibility = "hidden";

    MRegenOverlay.addEventListener("click", () => {
        MRegenOverlay.style.visibility = (MRegenOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        MRegenScroll.style.visibility = (MRegenScroll.style.visibility === "hidden") ? "visible" : "hidden";
    });

    document.body.appendChild(MRegenOverlay);

    const MRegenScroll = document.createElement("div");
    MRegenScroll.style.position = "absolute";
    MRegenScroll.className = "SmallFont";
    MRegenScroll.style.height = "60vh";
    MRegenScroll.style.overflowY = "auto";
    MRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    MRegenScroll.style.border = "0.05rem solid #ccc";
    MRegenScroll.style.background = "white";

    MRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const HRegenOverlay = document.createElement("div");
    HRegenOverlay.className = "HRegenOverlay";
    HRegenOverlay.style.position = "fixed";
    HRegenOverlay.style.top = 0;
    HRegenOverlay.style.left = 0;
    HRegenOverlay.style.width = "100%";
    HRegenOverlay.style.height = "100%";
    HRegenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    HRegenOverlay.style.zIndex = 1000;
    HRegenOverlay.style.display = "flex";
    HRegenOverlay.style.justifyContent = "center";
    HRegenOverlay.style.alignItems = "center";
    HRegenOverlay.style.visibility = "hidden";

    HRegenOverlay.addEventListener("click", () => {
        HRegenOverlay.style.visibility = (HRegenOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        HRegenScroll.style.visibility = (HRegenScroll.style.visibility === "hidden") ? "visible" : "hidden";
    });

    document.body.appendChild(HRegenOverlay);

    const HRegenScroll = document.createElement("div");
    HRegenScroll.style.position = "absolute";
    HRegenScroll.className = "SmallFont";
    HRegenScroll.style.height = "60vh";
    HRegenScroll.style.overflowY = "auto";
    HRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    HRegenScroll.style.border = "0.05rem solid #ccc";
    HRegenScroll.style.background = "white";

    HRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    DebuffOverlay.appendChild(DebuffScroll);
    HRegenOverlay.appendChild(HRegenScroll);
    MRegenOverlay.appendChild(MRegenScroll);
    SpeedBonusExOverlay.appendChild(speedBonusExScroll);

    const Scrolls = [speedBonusExScroll, MRegenScroll, HRegenScroll, DebuffScroll];

    Unit.allUnits.forEach((item, index) => {
        const items = [];
        items[0] = item.atkSpeedBuff;
        items[1] = item.manaRegen;
        items[2] = item.healthRegen;
        items[3] = item.slow;

        for(let i=0;i<=3;i++)
        {
            if(items[i]!==0)
            {

                const menu = document.createElement("label");
                menu.className = "CheckBox-Stack";
                menu.style.border = "0.001rem solid black";
                Scrolls[i].appendChild(menu);
    
                const unitName = document.createElement("p");
                unitName.innerText = `${item.name}(${item.rank}) ${items[i]}${(i===0||i==3) ? "%" : ""}`;
                switch(i)
                {
                    case 0:
                        unitName.className = `u-s${index}`;
                        break;
                        case 1:
                            unitName.className = `u-m${index}`;
                            break;
                            case 2:
                                unitName.className = `u-h${index}`;
                                break;
                                case 3:
                                    unitName.className = `u-d${index}`;
                                    break;
                }
                unitName.style.margin = "0";
                unitName.style.padding = "0.5rem";
                menu.appendChild(unitName);
    
                const Check = document.createElement("input");
                Check.type = "checkbox";
                const CheckName = [`s${index}`,`m${index}`,`h${index}`,`d${index}`]; 
                Check.className = CheckName[i];
                Check.style.position = 'relative';
                Check.style.zIndex = 10;
                Check.style.marginRight = "0.7vw";
                Check.style.transform = "scale(1.5)";
                Check.dataset.value = items[i];
                Check.checked = item.Check;   
    
                CheckEvent(Check, item, index);
    
                menu.appendChild(Check);
            }
        }

    })

    const MoveSpeedDebuffButton = document.createElement("div");
    MoveSpeedDebuffButton.className = "Debuff Button SmallFont";
    MoveSpeedDebuffButton.style.textAlign = "right";
    MoveSpeedDebuffButton.style.alignContent = "center";
    MoveSpeedDebuffButton.style.paddingRight = "0.25vw";
    MoveSpeedDebuffButton.innerText = Var.speedDebuff + "%";

    ButtonColor(MoveSpeedDebuffButton);

    MoveSpeedDebuffButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (DebuffOverlay.style.visibility === "hidden") {
            DebuffOverlay.style.visibility = "visible";
            DebuffScroll.style.visibility = "visible";
            const rect = MoveSpeedDebuffButton.getBoundingClientRect();
            const dropdownHeight = DebuffScroll.offsetHeight || 160;

            DebuffScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            DebuffScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            DebuffScroll.style.visibility = "hidden";
            DebuffOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(MoveSpeedDebuffButton);


    const Debuff = document.createElement("div");
    Debuff.className = "Button Bonus SmallFont";
    Debuff.innerText = "이속 감소";

    ButtonColor(Debuff);
    
    Debuff.addEventListener("click", () =>Overlay.openOverlay(300, 300));

    document.getElementsByClassName('Stack1')[0].appendChild(Debuff);

    SpeedBonusExButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (SpeedBonusExOverlay.style.visibility === "hidden") {
            SpeedBonusExOverlay.style.visibility = "visible";
            speedBonusExScroll.style.visibility = "visible";
            const rect = SpeedBonusExButton.getBoundingClientRect();
            const dropdownHeight = speedBonusExScroll.offsetHeight || 160;

            speedBonusExScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            speedBonusExScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            speedBonusExScroll.style.visibility = "hidden";
            SpeedBonusExOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusExButton);
    speedBonusExScroll.style.width = `${(SpeedBonusExButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const SpeedBonusEx = document.createElement("div");
    SpeedBonusEx.className = "Bonus SmallFont";
    SpeedBonusEx.innerText = "추가 공속";

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusEx);


    const MRegenButton = document.createElement("div");
    MRegenButton.className = "MRegen Button SmallFont";
    MRegenButton.id = "MRegen";
    MRegenButton.innerText = `${Var.manaRegen}`;
    MRegenButton.style.boxSizing = "border-box";
    MRegenButton.style.textAlign = "right";
    MRegenButton.style.alignContent = "center";
    MRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(MRegenButton);

    MRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (MRegenOverlay.style.visibility === "hidden") {
            MRegenScroll.style.visibility = "visible";
            MRegenOverlay.style.visibility = "visible";
            const rect = MRegenButton.getBoundingClientRect();
            const dropdownHeight = MRegenScroll.offsetHeight || 160;

            MRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            MRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            MRegenScroll.style.visibility = "hidden";
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(MRegenButton);
    MRegenScroll.style.width = `${(MRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const MRegen = document.createElement("div");
    MRegen.className = "Bonus SmallFont";
    MRegen.innerText = "마나 리젠";
    MRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(MRegen);

    const HRegenButton = document.createElement("div");
    HRegenButton.className = "HRegen Button SmallFont";
    HRegenButton.id = "HRegen";
    HRegenButton.innerText = `${Var.healthRegen}`;
    HRegenButton.style.boxSizing = "border-box";
    HRegenButton.style.textAlign = "right";
    HRegenButton.style.alignContent = "center";
    HRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(HRegenButton);

    HRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (HRegenOverlay.style.visibility === "hidden") {
            HRegenScroll.style.visibility = "visible";
            HRegenOverlay.style.visibility = "visible";
            const rect = HRegenButton.getBoundingClientRect();
            const dropdownHeight = HRegenScroll.offsetHeight || 160;

            HRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            HRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            HRegenScroll.style.visibility = "hidden"; 
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(HRegenButton);
    HRegenScroll.style.width = `${(HRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const HRegen = document.createElement("div");
    HRegen.className = "Bonus SmallFont";
    HRegen.innerText = "체력 리젠";
    HRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(HRegen);   

}



//스턴 지수

 StunView();

Stack();

const bar = document.getElementById("bar");

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

    const Formula = document.createElement("div");
    Formula.className = "Button Formula SmallFont";
    Formula.innerText = "가동률\n공식";
    Formula.style.alignContent = "center";
    Formula.style.textAlign = "center";
    Formula.style.padding = ".5vw 0 .5vw 0";
    Formula.addEventListener("click", () => {
        Overlay.openOverlay(200, 200);
    });
    ButtonColor(Formula);   

    bar.appendChild(Formula);

    const StunCalCulateMachine = document.createElement("div");
    StunCalCulateMachine.className = "Button SmallFont";
    StunCalCulateMachine.innerText = "스턴\n계산기";
    StunCalCulateMachine.style.alignContent = "center";
    StunCalCulateMachine.style.textAlign = "center";
    StunCalCulateMachine.addEventListener("click", () =>
    {
        Overlay.openOverlay(400, 400);
    })

    bar.appendChild(StunCalCulateMachine);
    ButtonColor(StunCalCulateMachine);

    const ManaControlCalculate = document.createElement("div");
    ManaControlCalculate.className = "Button SmallFont";
    ManaControlCalculate.innerText = "마나뻥\n계산기";
    ManaControlCalculate.style.alignContent = "center";
    ManaControlCalculate.style.textAlign = "center";    
    ManaControlCalculate.addEventListener("click", () =>
        {
            Overlay.openOverlay(500, 500);
        })

    bar.appendChild(ManaControlCalculate);
    ButtonColor(ManaControlCalculate);

    if (document.getElementById("container1")) {
        const Mana = document.createElement("div");
        Mana.className = "Button Mana SmallFont";
        Mana.innerText = "마나\n끄기";
        Mana.style.alignContent = "center";
        Mana.style.textAlign = "center";
        Mana.addEventListener("click", () => {
            if (Var.mana)
                Mana.innerText = "마나\n켜기";
            else
                Mana.innerText = "마나\n끄기";
            Var.mana = !Var.mana;
            Func.UnitTotalStun();
            CountOn();
        });

        ButtonColor(Mana);
        bar.appendChild(Mana);
    }    

    const Physical = document.createElement("div");
    Physical.className = "Button SmallFont";
    Physical.innerText = "방깍\n계산";
    Physical.style.alignContent = "center";
    Physical.style.textAlign = "center";

    Physical.addEventListener('click', () => {
        Overlay.openOverlay(600, 600);
    });
    
    ButtonColor(Physical);
    bar.appendChild(Physical);   
    
    const Ryuma = document.createElement("div");
    Ryuma.className = "Button SmallFont";
    Ryuma.innerText = "오니\n가르기";
    Ryuma.style.alignContent = "center";
    Ryuma.style.textAlign = "center";    
    
    Ryuma.addEventListener('click', () => {
        Overlay.openOverlay(700, 700);
    });
    
    ButtonColor(Ryuma);
    bar.appendChild(Ryuma);   
    
    const mono = document.createElement("div");
    mono.className = "Button SmallFont";
    mono.innerText = "단일\n효율";
    mono.style.alignContent = "center";
    mono.style.textAlign = "center";    
    
    mono.addEventListener('click', () => {
        Overlay.openOverlay(800, 800);
    });
    
    ButtonColor(mono);
    bar.appendChild(mono);
    

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
    deviation.style.gridArea = "1/3/2/4";

    deviation.addEventListener('click', () => {
        Var.deviationToggle = !Var.deviationToggle;
        CountOn();
    })

    ButtonColor(deviation);
    document.getElementsByClassName(`Stack4`)[0].appendChild(deviation);

ButtonColor(MoveSpeedPage);
document.getElementsByClassName(`Stack4`)[0].appendChild(MoveSpeedPage);

CountOn();

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = '#fff';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.innerHTML = '웹사이트에 새로운 업데이트가 있습니다!';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '닫기';
    closeButton.style.marginLeft = '10px';
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.color = '#4CAF50';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => notification.remove();
    
    notification.appendChild(closeButton);
    document.body.appendChild(notification);
  }

  import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const selector = document.getElementById("versionSelector");
const contentDiv = document.getElementById("content");

// index.json 가져와서 버전 목록 표시
fetch("https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/index.json", {
    cache: "no-store"
  })
  .then(res => res.json())
  .then(versions => {
    versions.forEach(entry => {
        const option = document.createElement("option");
        option.value = entry.version;
        option.textContent = `${entry.version} (${entry.date})`;
        selector.appendChild(option);
      });

    // 첫 번째 자동 로딩
    loadMarkdown(versions[0].version);
  });

selector.addEventListener("change", () => {
  const version = selector.value;
  loadMarkdown(version);
});

function loadMarkdown(version) {
  const url = `https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/${version}.md`;
  fetch(url)
    .then(res => res.text())
    .then(md => {
      contentDiv.innerHTML = marked.parse(md);
    })
    .catch(err => {
      contentDiv.innerHTML = `<p style="color:red;">❌ 로딩 실패: ${err.message}</p>`;
    });
}

let socket;
let reconnectAttempts = 0;
let first = true;

function connectWebSocket(){
    socket = new WebSocket("wss://4ixs2roym1.execute-api.ap-northeast-2.amazonaws.com/production");

 
    socket.onopen = () => {
        console.log("✅ WebSocket 연결됨");
    
        // 연결되자마자 서버에 초기 데이터 요청
        if(first)
        {
            socket.send(JSON.stringify({
                action: ""
            }));
            first = false;
        }

    };
    
    socket.onmessage = (event) => {
        if(JSON.parse(event.data).message === "Update")
        {
            showUpdateNotification();
        }
        else 
        {
            console.log("알 수 없는 메세지");
        }
    };
    
    socket.onerror = (error) => {
        console.error("❌ WebSocket 오류 발생:", error);
    };
    
    socket.onclose = (event) => {
        console.warn("⚠️ WebSocket 연결 종료! 코드:", event.code, "이유:", event.reason);

        // 백오프 전략 적용 (최대 30초까지 증가)
        let delay = Math.min(3000 * (2 ** reconnectAttempts), 30000);
        console.log(`⏳ ${delay / 1000}초 후 재연결 시도...`);
        setTimeout(connectWebSocket, delay);

        reconnectAttempts++;
    };
}

connectWebSocket();


import {Var, Func, Overlay, Unit} from "./import.js";

export function openMoveSpeedPage(ctx){

    const container = window.container;
    const containerGrid = Var.containerGrid;
    const allUnits = Unit.allUnits;
    const Stack = window.Stack;
    const ButtonColor = window.ButtonColor;
    const CountOn = window.CountOn;
    const SetElemental = Func.SetElemental;

    const Container2 = document.createElement('div');
    Container2.className = "container";
    Container2.id = "container2";
    Container2.style.gridTemplateRows = `repeat(${containerGrid}, 1fr)`;

    let i = 0;

    container.replaceWith(Container2);
    for (let unitCount = 0; unitCount <= allUnits.length + Math.floor(i/containerGrid);unitCount++, i++) {

        if (i % containerGrid == 0) {
            const Units = document.createElement("div"); 
            Units.id = `u-${i}`;
            Units.style.boxSizing = "border-box";
            Units.style.display = "grid";
            Units.style.gridTemplateColumns = "repeat(4, 1fr)";
            Container2.appendChild(Units);

            const UnitName = document.createElement("button");
            UnitName.className = "Button unitSort MoreSmallFont UnitNameBar";
            UnitName.boxSizing = "border-box";
            UnitName.textContent = (Var.nameSort == 0) ? "유닛명" : (Var.nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
            UnitName.addEventListener("click", () => {
                if (Var.nameSort <= 0)
                    Var.nameSort = 1;
                else
                    Var.nameSort = -1;
                Var.rateSort = 0;
                Var.moveSpeedSort = 0;
                Var.afterShockSort = 0;

                allUnits.sort((a, b) => {
                    if (Var.nameSort == 1) {    
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                    }
                    if (Var.nameSort == -1) {
                        if (a.name < b.name) return 1;
                        if (a.name > b.name) return -1;
                    }
                    return Unit.SortFunction(a, b);
                });
                CountOn();
            })

            ButtonColor(UnitName);
            Units.append(UnitName);

            const UnitSort = document.createElement("button");
            UnitSort.className = "Button unitSort MoreSmallFont UnitSortBar";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = "등급";
            UnitSort.addEventListener("click", () => {
                Var.nameSort = 0;
                if (Var.rateSort <= 0)
                    Var.rateSort = 1;
                else
                    Var.rateSort = -1;
                Var.moveSpeedSort = 0;
                Var.afterShockSort = 0;

                  allUnits.sort((a, b) => {
                    const ra = Unit.unitRates[a.rank] ?? 9999;
                    const rb = Unit.unitRates[b.rank] ?? 9999;

                    if (ra !== rb) return (ra - rb) * Var.rateSort; // ✅ 숫자 등급 정렬

                    return Unit.SortFunction(a, b); // 같은 등급이면 나머지 기준
                });
                CountOn();
            })

            ButtonColor(UnitSort);
            Units.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button unitSort MoreSmallFont MoveSpeedBar";
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.textContent = "이감 발동률";
            MoveSpeed.addEventListener("click", () => {
                Var.nameSort = 0;
                Var.rateSort = 0;
                if (Var.moveSpeedSort <=0)
                    Var.moveSpeedSort = 1;
                else
                    Var.moveSpeedSort = -1;
                Var.afterShockSort = 0;

                allUnits.sort((a, b) => {
                    if (a.SlowCalculate > b.SlowCalculate) return (Var.moveSpeedSort == 1) ? -1 : 1;
                    if (a.SlowCalculate < b.SlowCalculate) return (Var.moveSpeedSort == 1) ? 1 : -1;

                    return Unit.SortFunction(a, b);
                });
                CountOn();
            })

            ButtonColor(MoveSpeed);
            Units.appendChild(MoveSpeed);

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button unitSort MoreSmallFont AfterShockBar";
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.textContent = "여진 가동률";

            AfterShock.addEventListener("click", () => {
                Var.nameSort = 0;
                Var.rateSort = 0;
                Var.moveSpeedSort = 0;
                if (Var.afterShockSort <= 0)
                    Var.afterShockSort = 1;
                else
                    Var.afterShockSort = -1;

                allUnits.sort((a, b) => {
                    if (a.EarthCalculate > b.EarthCalculate) return (Var.afterShockSort == 1) ? -1 : 1;
                    if (a.EarthCalculate < b.EarthCalculate) return (Var.afterShockSort == 1) ? 1 : -1;

                    return Unit.SortFunction(a, b);
                });
                CountOn();
            })

            ButtonColor(AfterShock);
            Units.appendChild(AfterShock);
        }
        else
            {
                let newInt = unitCount - 1 - Math.floor(i/containerGrid);
            if(allUnits[newInt].SlowCalculate == 0 && allUnits[newInt].EarthCalculate == 0){
                i--;
                continue;
            }

                const chairInt = i - 1 - Math.floor(i / containerGrid);

            const Units = document.createElement("div");
            Units.id = `u-${newInt}`;
            Units.style.boxSizing = "border-box";
            Units.style.display = "grid";
            Units.style.gridTemplateColumns = "repeat(4, 1fr)";
            Container2.appendChild(Units);
                
            const UnitName = document.createElement("div");
            UnitName.className = "unitName SmallFont";
            UnitName.id = `n-${chairInt}`;
            UnitName.style.border = "0.001rem solid black";
            UnitName.style.boxSizing = "border-box"; // boxSizing 추가
            UnitName.textContent = `${allUnits[newInt].name}`;

            Units.appendChild(UnitName);

            const UnitSort = document.createElement("div");
            UnitSort.className = "unitName SmallFont";
            UnitSort.id = `s-${chairInt}`;
            UnitSort.style.border = "0.001rem solid black";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = `${allUnits[newInt].rank}`;

            Units.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button SmallFont";
            MoveSpeed.id = `m-${chairInt}`;
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.addEventListener('click', () => {
        
                let unitNumber = 0;
                for(let count = -1; count < chairInt; unitNumber++)
                {
                    if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                        count++;}
                }
                unitNumber--;

                if(allUnits[unitNumber].slow1.type == "none") return;
                Overlay.openOverlay(-1, chairInt);

            })

            ButtonColor(MoveSpeed);
            Units.appendChild(MoveSpeed);
            MoveSpeed.textContent = `${((allUnits[newInt].SlowCalculate) * 100).toFixed(2)}%`;

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button SmallFont";
            AfterShock.id = `a-${chairInt}`;
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.addEventListener('click', () => {
        
                let unitNumber = 0;
                for(let count = -1; count < chairInt; unitNumber++)
                {
                    if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                        count++;}
                }
                unitNumber--;

                if(allUnits[unitNumber].slow2.type == "none") return;
                Overlay.openOverlay(-2, chairInt);
            })

            ButtonColor(AfterShock);
            Units.appendChild(AfterShock);
            AfterShock.textContent = `${((allUnits[newInt].EarthCalculate) * 100).toFixed(2)}%`; 
        }
    }

    Stack();


    const StunPage = document.createElement("button");
    StunPage.className = "Button Stun SmallFont";
    StunPage.innerText = "스턴";
    StunPage.style.gridArea = "1/4/2/5";

    StunPage.addEventListener('click', () => {

        Container2.replaceWith(container);
        CountOn();
        SetElemental();
    })

    ButtonColor(StunPage);
    document.getElementsByClassName(`Stack4`)[0].appendChild(StunPage);

}
import {Unit, Var, Overlay, Func} from "./import.js"

function Checked(target, sort, unit)
        {

            if(Unit.getUnit(sort, unit).name==="퀸")
                {
                    if(target.id.split(`-`)[0] === "p")
                    {
                        Var.manaRegen += 1;
                        Var.healthRegen += 1;
                    }
                    else
                    {
                        Var.manaRegen -= 1;
                        Var.healthRegen -= 1;
                    }
                    const index = Unit.allUnits.findIndex(items => items.rank == "왜곡됨" && items.name == "퀸");
                    Unit.allUnits[index].Check = target.id.split(`-`)[0]==="p" ? 1 : 0;
                    document.getElementsByClassName(`m${index}`)[0].checked = target.id.split(`-`)[0]==="p" ? true : false;
                    document.getElementsByClassName(`h${index}`)[0].checked = target.id.split(`-`)[0]==="p" ? true : false;
                }
            else if(Unit.getUnit(sort, unit).name === '우타')
            {
                let index = Unit.allUnits.findIndex(items => items.name == "우타의 헤드셋" && items.rank == "아이템");

                const uta = Unit.getUnit(sort, unit)
                const utaIndex = Unit.allUnits.findIndex((items => items.name === '우타'));
                if(target.id.split(`-`)[0] === "p")
                {
                    if(Unit.allUnits[index].Check == 0)
                    {
                        Unit.allUnits[index].Check = 1 ;
                        document.getElementsByClassName(`s${index}`)[0].checked = true;
                        document.getElementsByClassName(`s${utaIndex}`)[0].checked = true;
                        document.getElementsByClassName(`d${utaIndex}`)[0].checked = true;
                    }
                    else
                    {
                        Var.speedBonusEx -= Unit.allUnits[index].atkSpeedBuff;
                    }
                }
                else
                {
                    Var.speedBonusEx += Unit.allUnits[index].atkSpeedBuff;
                    Unit.allUnits[utaIndex].Check = 0;
                    window.Collect(Unit.allUnits[utaIndex], utaIndex);
                }

                const CheckUta = Unit.allUnits.find(items => items.rank == uta.rank && items.name == uta.name).Check;
            
                Var.speedDebuff += CheckUta > 0 ? uta.slow : -uta.slow;

            }
            else{
                const U = Unit.getUnit(sort, unit);
                const index = Unit.allUnits.findIndex(items => items.name == U.name && items.rank == U.rank);
                const slowU = Unit.allUnits[index];
                if(slowU !== null)
                {
                    slowU.Check = target.id.split(`-`)[0] === "p" ? 1 : 0;    
                    Var.manaRegen += slowU.Check ? slowU.manaRegen : -slowU.manaRegen;
                    Var.healthRegen +=  slowU.Check ? slowU.healthRegen : -slowU.healthRegen;
                    Var.speedDebuff +=  slowU.Check ? slowU.atkSpeedBuff : -slowU.atkSpeedBuff;
                    window.Collect(slowU, index);
                }
            }
        }


export function StunView(){
    for(let sortCount = 0; sortCount < Object.keys(Unit.unitStat).length; sortCount++){
        let check = false;
       for(let unitCount =0; unitCount < Unit.unitStat[Unit.idxToRank(sortCount)].length; unitCount++)
     {
    
            if(Unit.getUnit(sortCount, unitCount).stun1.type == "none" && Unit.getUnit(sortCount, unitCount).manaRange == 0) 
                {
                    continue;
                }
    
            if (!check) {
    
            const UnitBar = document.createElement("div");
            UnitBar.style.display = "flex";
            UnitBar.style.boxSizing = "border-box";
            container.appendChild(UnitBar);
    
            const newChild = document.createElement("div");
            newChild.className = 'unitSort SmallFont';
            newChild.innerText = Unit.idxToRank(sortCount);
            newChild.style.border = "0.001rem solid black";
            newChild.style.width = "100%";
    
            switch (sortCount) {
                case Unit.unitRates.희귀함:
                    newChild.style.color = "rgb(204,0,255)";
                    break;
                case Unit.unitRates.전설적인:
                    newChild.style.color = "rgb(255,0,0)";
                    break;
                case Unit.unitRates.히든:
                    newChild.style.color = "rgb(156,195,230)";
                    break;
                case Unit.unitRates.초월함:
                    newChild.style.color = "rgb(0,255,204)";
                    newChild.style.background = "rgb(64,64,64)";
                    break;
                case Unit.unitRates.불멸의:
                    newChild.style.color = "rgb(153,51,0)";
                    break;
                case Unit.unitRates.영원한:
                    newChild.style.color = "rgb(204,0,204)";
                    break;
                case Unit.unitRates.제한됨:
                    newChild.style.color = "rgb(255 255,0)";
                    newChild.style.background = "rgb(89,89,89)";
                    break;
                case Unit.unitRates.신비함:
                    newChild.style.color = "rgb(091,151,213)";
                    break;
                case 8:
                    break;
            }
            UnitBar.appendChild(newChild);
            check = true;
        }
    
    
        const UnitBar = document.createElement("div");
        UnitBar.style.display = "flex";
        UnitBar.style.boxSizing = "border-box";
        container.appendChild(UnitBar);
      
                
            const UnitChildBar = document.createElement("div");
            UnitChildBar.style.display = "grid";
            UnitChildBar.style.gridTemplateColumns = "repeat(3, 1fr)";
            UnitChildBar.style.width = "100%";
    
            UnitBar.appendChild(UnitChildBar);
    
            const unitName = document.createElement("button");
            unitName.className = 'Button unitName SmallFont';
            unitName.id = `n-${sortCount}-${unitCount}`;
            unitName.innerText = Unit.getUnit(sortCount,unitCount).name;
            if (Unit.getUnit(sortCount,unitCount).name === "크로커다일(특강)")
                unitName.style.fontSize = "0.65vw";
    
            unitName.addEventListener("click", (event) => {
                Overlay.openOverlay(event.target.id.split('-')[1], event.target.id.split('-')[2]);
            })
            ButtonColor(unitName);
    
            const stunRate = document.createElement("div");
            stunRate.className = 'Rate SmallFont';
            stunRate.id = `r-${sortCount}-${unitCount}`;
            stunRate.style.boxSizing = 'border-box';
            stunRate.innerText = Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
            stunRate.style.justifyContent = "center";
    
            const percentage = document.createElement("div");
            percentage.className = 'Rate SmallFont';
            percentage.id = `per-${sortCount}-${unitCount}`;
            percentage.style.boxSizing = 'border-box';
            percentage.innerText = ((1 - Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2) + "%";
            percentage.style.justifyContent = "center";
    
            const count = document.createElement("div");
            count.className = 'Count SmallFont';
            count.id = `c-${sortCount}-${unitCount}`;
    
            const u = Unit.getUnit(sortCount, unitCount);
    
            count.innerText = `${Unit.allUnits.find(items => items.name == u.name && items.rank == u.rank).Check}`;
            count.style.justifyContent = "center";
            count.style.aspectRatio = "1";
            count.style.height = `${Var.GridHeight}vw`;
            count.style.boxSizing = "border-box";
    
            const preloadImages = ["plus.svg", "minus.svg"];
            preloadImages.forEach(src => {
            const img = new Image();
            img.src = src;
            });
    
            const plus = document.createElement("img");
            plus.className = 'IMG SmallFont';
            plus.src = "plus.svg";
            plus.id = `p-${sortCount}-${unitCount}`;
            plus.style.height = `${Var.GridHeight}vw`;
            plus.style.aspectRatio = "1";
            plus.style.boxSizing = "border-box";
            plus.addEventListener('click', () => {
                const id = plus.id.split(`-`);
                const sort = id[1];
                const unit = id[2];
                const u = Unit.getUnit(sortCount, unitCount)
                const CheckU = Unit.allUnits.find(items => items.name == u.name && items.rank == u.rank);
                CheckU.Check++;
                if (CheckU.Check == 1) {
                    Var.speedBonusEx += Unit.getUnit(sortCount,unitCount).atkSpeedBuff;
    
                    Checked(plus, sort, unit);
                    const u = Unit.getUnit(sort, unit);
    
                    Var.Sort.push([sort, unit, u.stun1.r]);
                    Var.Sort.push([sort, unit, u.stun2.r]);
                    Var.Sort.push([sort, unit, u.manaRange]);
    
                    Var.Sort.sort((a, b) => a[2] - b[2]);
                }
                Func.UnitTotalStun();
                CountOn();
            });                
            ButtonColor(plus);
    
            const minus = document.createElement("IMG");
            minus.className = 'IMG SmallFont';
            minus.src = "minus.svg";
            minus.id = `m-${sortCount}-${unitCount}`;
            minus.style.height = `${Var.GridHeight}vw`;
            minus.style.aspectRatio = "1";
            minus.style.boxSizing = "border-box";
            minus.addEventListener('click', () => {
                const id = minus.id.split(`-`);
                const sort = id[1];
                const unit = id[2];
                const u = Unit.getUnit(sortCount, unitCount)
                const CheckU = Unit.allUnits.find(items => items.name == u.name && items.rank == u.rank);
                CheckU.Check--;
                if (CheckU.Check < 0){
                    CheckU.Check = 0;
                }
                else if (CheckU.Check == 0) {
                    Var.speedBonusEx -= Unit.getUnit(sortCount,unitCount).atkSpeedBuff;
                    Checked(minus, sort, unit);
    
                    const u = Unit.getUnit(sort,unit);
    
                    Var.Sort = Var.Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== u.stun1.r);
                    Var.Sort = Var.Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== u.stun2.r);
                    Var.Sort = Var.Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== u.manaRange);
      
                }  
                Func.UnitTotalStun();
                CountOn();
            }
            );
    
            ButtonColor(minus);
    
            UnitChildBar.appendChild(unitName);
            UnitChildBar.appendChild(stunRate);
            UnitChildBar.appendChild(percentage);
            UnitBar.appendChild(count);
            UnitBar.appendChild(plus);
            UnitBar.appendChild(minus);
        }
    }
}

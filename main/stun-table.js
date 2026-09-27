import { Var, Unit, Func } from "../import.js";

export function refreshStunTable() {
    Var.totalStun = 0;
    for (let sortCount = 0; sortCount < Object.keys(Unit.unitStat).length; sortCount++) {
        for (let unitCount = 0; unitCount < Unit.unitStat[Unit.idxToRank(sortCount)].length; unitCount++) {
            if(Unit.getUnit(sortCount, unitCount).stun1.type == "none" && Unit.getUnit(sortCount, unitCount).manaRange == 0) continue;
            const percentage = document.getElementById(`per-${sortCount}-${unitCount}`);
            percentage.innerText = ((1 - Math.pow(Var.StunCalCulation, Unit.getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2) + "%";

            const Count = document.getElementById(`c-${sortCount}-${unitCount}`);
            const u = Unit.getUnit(sortCount, unitCount);
            const CheckU = Unit.allUnits.find(items => items.name == u.name && items.rank == u.rank);
            Count.innerText = CheckU.Check;
            Count.parentElement.classList.toggle("unit-selected", CheckU.Check > 0);

            Var.totalStun += (CheckU.Check > 0) ? Unit.getUnit(sortCount, unitCount).StunCalCulate * CheckU.Check : 0;

            const rate = document.getElementById(`r-${sortCount}-${unitCount}`);
            if(Var.deviationToggle == false)
                rate.innerText = Unit.getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
            else
            {
                const u = Unit.getUnit(sortCount, unitCount);

                if(u.stun1.type === "cooldown") {
                    rate.innerText = `${u.stun1.cd}초`;
                    continue;
                }
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
                    let time1 = 0.65 + 0 / t - u.stun1.dur;
                    if (time1 > 0)
                        count++;
                    else
                        time1 = 0;

                    let time2 = 0.65 + 1 / t - u.stun1.dur;
                    if (time2 > 0)
                        count++;
                    else
                        time2 = 0;

                    let time3 = 0.65 + 2 / t - u.stun1.dur;
                    if (time3 > 0)
                        count++;
                    else
                        time3 = 0;

                    let time4 = 0.65 + 3 / t - u.stun1.dur;
                    if (time4 > 0)
                        count++;
                    else
                        time4 = 0;

                    let time5 = 0.65 + 4 / t - u.stun1.dur;
                    if (time5 > 0)
                        count++;
                    else
                        time5 = 0;

                    let time6 = 0.65 + 5 / t - u.stun1.dur;
                    if (time6 > 0)
                        count++;
                    else
                        time6 = 0;

                    let time7 = 0.65 + 6 / t - u.stun1.dur;
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


        }
    }
}

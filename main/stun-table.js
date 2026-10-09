import { Var, Unit } from "../import.js";
import { STUN_DEVIATION_WINDOW, unitStunDeviation } from "../units/stun-deviation.js";

export function refreshStunTable() {
    Var.totalStun = 0;
    for (let sortCount = 0; sortCount < Object.keys(Unit.unitStat).length; sortCount++) {
        for (let unitCount = 0; unitCount < Unit.unitStat[Unit.idxToRank(sortCount)].length; unitCount++) {
            const u = Unit.getUnit(sortCount, unitCount);
            if (u.stun1.type === "none" && u.manaRange === 0) continue;
            const percentage = document.getElementById(`per-${sortCount}-${unitCount}`);
            percentage.innerText = ((1 - Math.pow(Var.StunCalCulation, u.StunCalCulate)) * 100).toFixed(2) + "%";

            const count = document.getElementById(`c-${sortCount}-${unitCount}`);
            const selected = Unit.allUnits.find(unit => unit.name === u.name && unit.rank === u.rank);
            count.innerText = selected.Check;
            count.parentElement.classList.toggle("unit-selected", selected.Check > 0);
            Var.totalStun += selected.Check > 0 ? u.StunCalCulate * selected.Check : 0;

            const rate = document.getElementById(`r-${sortCount}-${unitCount}`);
            if (!Var.deviationToggle) {
                rate.innerText = u.StunCalCulate.toFixed(3) + "스턴";
                rate.title = "";
                continue;
            }
            const estimate = unitStunDeviation(u);
            rate.innerText = estimate ? `±${estimate.deviationPercent.toFixed(2)}%` : "별도 기믹";
            rate.title = estimate?.model === 'cycle'
                ? `${STUN_DEVIATION_WINDOW}초 기준 가동률 표준편차 ±${estimate.deviationPercent.toFixed(2)}퍼센트포인트. 평균 ${estimate.meanPercent.toFixed(2)}%. 가동률과 동일한 0.65초 대기·공속에 따른 첫 타격 지연·7타 확정 주기로 계산한 시뮬레이션 근사치입니다.`
                : estimate
                ? `${STUN_DEVIATION_WINDOW}초 기준 가동률 표준편차 ±${estimate.deviationPercent.toFixed(2)}퍼센트포인트. 일반 확률형 모델 평균 ${estimate.meanPercent.toFixed(2)}%. 마나·소환·변신·공격 정지 등 별도 기믹은 제외한 근사치이며 보장 범위가 아닙니다.`
                : "일반 공격 확률형 스턴이 없어 별도 기믹의 편차 모델이 필요합니다.";
        }
    }
}

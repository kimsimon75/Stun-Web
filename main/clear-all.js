import { Var, Unit, Func, Overlay } from "../import.js";
import { CountOn } from "./refresh.js";

// 페이지를 새로고침하지 않고 조합과 입력 상태를 초기화합니다.
export function ClearAll() {
    // 편집 중인 능력치가 blur 이벤트로 다시 저장되지 않도록 먼저 종료합니다.
    document.querySelectorAll("input[data-stat-input]").forEach(input => {
        input.value = "0";
        input.blur();
        input.remove();
    });

    Var.speedBonusEx = 0;
    Var.totalStun = 0;
    Var.manaRegen = 0;
    Var.healthRegen = 0;
    Var.speedDebuff = 0;
    Var.koby = 0;
    Var.dex = 0;
    Var.intel = 0;
    Var.mana = true;
    Var.deviationToggle = false;
    Var.Sort.length = 0;

    for (const units of Object.values(Unit.unitStat)) {
        for (const unit of units) {
            unit.Check = 0;
        }
    }

    Unit.allUnits.forEach((item) => {
        item.Check = 0;
    });

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    });

    document.querySelectorAll("[data-stat]").forEach(button => {
        button.innerText = "0";
        button.style.display = "";
    });
    document.querySelectorAll(".Mana").forEach(button => {
        button.innerText = "마나\n끄기";
    });
    document.querySelectorAll(".search-bar input").forEach(input => {
        input.value = "";
    });
    document.querySelectorAll(".CheckBox-Stack").forEach(item => {
        item.style.display = "flex";
    });

    // 계산기 입력값과 내부 토글 상태는 창을 닫아 함께 폐기합니다.
    Overlay.closeOverlay();
    document.querySelectorAll(".DebuffOverlay, .SpeedBonusExOverlay, .MRegenOverlay, .HRegenOverlay").forEach(overlay => {
        overlay.style.visibility = "hidden";
        for (const panel of overlay.children) {
            panel.style.visibility = "hidden";
        }
    });

    Func.UnitTotalStun();
    CountOn();
}

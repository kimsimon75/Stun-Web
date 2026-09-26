import { getSlowUnits } from "./main/slow-units.js";
import { Var, Unit } from "./import.js";
import { renderStunSummary } from "./overlays/stun-summary.js";
import { renderUptimeFormula } from "./overlays/uptime-formula.js";
import { renderMovementSpeed } from "./overlays/movement-speed.js";
import { renderStunCalculator } from "./overlays/stun-calculator.js";
import { renderManaTiming } from "./overlays/mana-timing.js";
import { renderPhysicalDamage } from "./overlays/physical-damage.js";
import { renderRyumaCondition } from "./overlays/ryuma-condition.js";
import { renderSingleTarget } from "./overlays/single-target.js";
import { renderSlow } from "./overlays/slow.js";
import { renderAftershock } from "./overlays/aftershock.js";
import { renderNika } from "./overlays/nika.js";
import { renderUnitDetail } from "./overlays/unit-detail.js";

export function openOverlay(sortCount, unitCount) {
    if (document.getElementById("overlay")) return; // 이미 오버레이가 있으면 실행 안 함

    sortCount = Number(sortCount);
    unitCount = Number(unitCount);

    const u = Unit.getUnit(sortCount, unitCount);
    const isTool = sortCount === unitCount && [100, 200, 300, 400, 500, 600, 700, 800].includes(sortCount);
    const isSlow = [-1, -2].includes(sortCount) && getSlowUnits()[unitCount];
    if (!u && !isTool && !isSlow) return;

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
    overlayContent.className = "overlay-card";
    overlayContent.setAttribute("role", "dialog");
    overlayContent.setAttribute("aria-modal", "true");
    overlayContent.setAttribute("aria-labelledby", "overlay-title");
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
                    overlayContent.querySelector(".StunButton")?.click();
                }
            }
        }
    });
    
    setTimeout(() => {
        overlay.focus();
    }, 0);
    {
            const closeButton = document.createElement("button");
            closeButton.innerText = "×";
            closeButton.className = "overlay-close";
            closeButton.setAttribute("aria-label", "닫기");
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
            closeButton.onclick = closeOverlay;
        
            overlayContent.appendChild(closeButton);

            document.addEventListener("keydown", handleEscapeKey);
        }



    // 3. 콘텐츠 박스 상단에 타이틀 추가
    const title = document.createElement("h2");
    title.id = "overlay-title";
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
        
        const slowUnit = getSlowUnits()[unitCount];
        title.textContent = slowUnit.name + " (" + slowUnit.rank + ")";
    }
    else
        title.textContent = `${u.name} (${Unit.idxToRank(sortCount)})`;

    overlayContent.appendChild(title);

    // 4. 목록 추가
    const itemList = document.createElement("ul");
    itemList.style.listStyleType = "none";
    itemList.style.padding = 0;
    if (sortCount == 100 && unitCount == 100) {
        renderStunSummary({ itemList });
    }
    else if (sortCount == 200 && unitCount == 200) {
        renderUptimeFormula({ itemList });
    }
    else if (sortCount == 300 && unitCount == 300) {
        renderMovementSpeed({ itemList });
    }
    else if (sortCount == 400 && unitCount == 400) {
        renderStunCalculator({ overlayContent });
    }
    else if (sortCount === 500 && unitCount === 500) {
        renderManaTiming({ itemList });
    }
    else if (sortCount == 600 && unitCount == 600) {
        renderPhysicalDamage({ overlayContent });
    }
    else if (sortCount == 700 && unitCount == 700) {
        renderRyumaCondition({ overlayContent });
    }
    else if (sortCount == 800 && unitCount == 800) {
        renderSingleTarget({ itemList });
    }
    else if (sortCount == -1) {
        renderSlow({ itemList, unitCount });
    }
    else if (sortCount == -2) {
        renderAftershock({ itemList, unitCount });
    }
    else if (u.name === "니카") {
        renderNika({ itemList, sortCount, unitCount, u });
    }
    else {
        renderUnitDetail({ itemList, sortCount, unitCount, u });
    }
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

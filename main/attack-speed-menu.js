import { Var } from "../import.js";
import { ButtonColor } from "./button-style.js";
import { separateKorean } from "./korean-search.js";

export function createAttackSpeedMenu() {
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
    return { SpeedBonusExButton, SpeedBonusExOverlay, speedBonusExScroll };
}

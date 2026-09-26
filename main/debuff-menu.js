import { separateKorean } from "./korean-search.js";

export function createDebuffMenu() {
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
    return { DebuffOverlay, DebuffScroll };
}

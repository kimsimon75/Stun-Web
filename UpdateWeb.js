
const API_URL =
  "https://pc4rdhklej.execute-api.ap-northeast-2.amazonaws.com";

const GAME_ID = "testgame01";

async function fetchGameData() {
    try {
        const response = await fetch(
            `${API_URL}/games/${GAME_ID}/latest`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("게임 데이터:", data);

        // 여기서 화면 갱신
        updateGameUI(data);

    } catch (error) {
        console.error("조회 실패:", error);
    }
}

function updateGameUI(data) {
    for (const unit of data.units ?? []) {
        console.log(unit.name, unit.count);
    }
}

// 2초마다 조회
fetchGameData();
setInterval(fetchGameData, 2000);

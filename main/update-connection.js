import { showUpdateNotification } from "./update-notification.js";

export function connectUpdates() {
    let socket;
    let reconnectAttempts = 0;
    let first = true;

    function connectWebSocket(){
        socket = new WebSocket("wss://4ixs2roym1.execute-api.ap-northeast-2.amazonaws.com/production");

        socket.onopen = () => {
            reconnectAttempts = 0;
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
            let message;
            try { message = JSON.parse(event.data); }
            catch { return; }
            if(message?.message === "Update")
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
}

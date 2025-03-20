const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();

// 정적 파일 제공 (index.html 같은 클라이언트 파일 서빙 가능)
app.use(express.static(__dirname));

// HTTP 서버 생성 (Express 사용)
const server = http.createServer(app);

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('✅ 클라이언트가 WebSocket으로 연결되었습니다!');

    ws.send('서버: 연결 성공!'); // ✅ 한글 정상 출력

    ws.on('message', (message) => {
        const decodedMessage = message.toString('utf-8');  // ✅ 한글 깨짐 방지
        console.log(`📩 받은 메시지: ${decodedMessage}`);

        ws.send(`서버에서 받은 메시지: ${decodedMessage}`); // ✅ 한글 정상 응답
    });

    ws.on('close', () => {
        console.log('❌ 클라이언트 연결 종료');
    });
});

// 라우트 설정 (index.html 제공)
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// 서버 실행 (ws://localhost:8080 사용 가능)
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중!`);
    console.log(`🚀 WebSocket은 ws://localhost:${PORT} 에서 실행 중!`);
});

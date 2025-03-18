const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();
app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html");
})

// HTTP 서버 생성 (웹소켓을 위한 기본 HTTP 서버)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
});

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('✅ 클라이언트가 ws:// 로 연결되었습니다!');

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

// 서버 실행 (ws://localhost:8080 사용 가능)
server.listen(8080, () => {
    console.log('🚀 HTTP & WebSocket 서버가 ws://localhost:8080 에서 실행 중!');
});


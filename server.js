const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();

// 정적 파일 제공 (index.html 같은 클라이언트 파일 서빙 가능)
app.use(express.static(__dirname));

// HTTP 서버 생성 (Express 사용)
const server = http.createServer(app);

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

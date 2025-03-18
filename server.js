const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

// SSL 인증서 불러오기
const server = https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
});

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('✅ 클라이언트가 wss:// 로 연결되었습니다!');

    ws.on('message', (message) => {
        console.log(`📩 받은 메시지: ${message}`);
        ws.send(`서버에서 받은 메시지: ${message}`);
    });

    ws.on('close', () => {
        console.log('❌ 클라이언트 연결 종료');
    });
});

// HTTPS & WebSocket 서버 실행
server.listen(8080, () => {
    console.log('🚀 HTTPS & WebSocket 서버가 wss://localhost:8443 에서 실행 중!');
});

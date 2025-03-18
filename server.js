const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('✅ 클라이언트가 연결되었습니다.');

    ws.send('서버: 연결 성공!'); // 한글 정상 출력

    ws.on('message', (message) => {
        const decodedMessage = message.toString('utf-8');  // ✅ 한글 깨짐 방지
        console.log(`📩 클라이언트 메시지: ${decodedMessage}`);
        
        ws.send(`서버에서 받은 메시지: ${decodedMessage}`); // 한글 정상 응답
    });

    ws.on('close', () => {
        console.log('❌ 클라이언트 연결 종료');
    });
});

console.log('🚀 웹소켓 서버가 ws://localhost:8080 에서 실행 중!');

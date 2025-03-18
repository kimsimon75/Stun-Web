const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('새로운 클라이언트 연결됨!');

    ws.send('서버: 연결 성공!');

    ws.on('message', (message) => {
        console.log(`클라이언트로부터 받은 메시지: ${message}`);
        ws.send(`서버에서 받은 메시지: ${message}`);
    });

    ws.on('close', () => {
        console.log('클라이언트 연결 종료');
    });
});

console.log('웹소켓 서버가 ws://localhost:8080 에서 실행 중!');

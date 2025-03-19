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

wss.on("connection", (ws) => {
    console.log("클라이언트가 연결됨");
  });
  
  app.post("/webhook", (req, res) => {
    console.log("웹훅 요청 받음:", req.body);
  
    // 모든 웹소켓 클라이언트에게 메시지 전송
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send("새로운 웹훅이 도착했습니다. 새로고침하세요!");
      }
    });
  
    res.send("웹훅 처리 완료");
  });
  
  app.listen(8080, () => console.log("서버 실행 중 🚀"));

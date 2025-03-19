import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

const wss = new WebSocketServer({ port: 8080 }); // 웹소켓 서버 실행

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

app.listen(3000, () => console.log("서버 실행 중 🚀"));

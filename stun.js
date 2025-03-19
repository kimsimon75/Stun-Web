const socket = new WebSocket("wss://o5wmuffu1h.execute-api.ap-southeast-2.amazonaws.com/production");

socket.onopen = () => {
  console.log("✅ 웹소켓 연결 성공!");
};

socket.onmessage = (event) => {
    console.log("hello");
  const message = JSON.parse(event.data);
  if (message.action === "webhook") {
    alert(message.data); // 알림 띄우기
    location.reload(); // 새로고침
  }
};
const message = JSON.stringify({
    action: "connect",  // API Gateway에서 설정한 라우트 이름
    data: "Hello, WebSocket!"
});

socket.send(message);

socket.onclose = () => {
  console.log("❌ 웹소켓 연결 종료됨");
};

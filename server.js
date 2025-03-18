const express = require('express');
const app = express();

app.use('/Stun.css', express.static(__dirname + '/Stun.css'));
app.use('/stun.js', express.static(__dirname + '/stun.js'));
app.use('/plus.png', express.static(__dirname + '/plus.png'));
app.use('/minus.png', express.static(__dirname + '/minus.png'));

app.listen(8080, function(){
    console.log('listening on 8080');
});

app.get("/", function(요청, 응답){
    응답.sendFile(__dirname + '/index.html');
});

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('서버와 웹소켓 연결 완료!');
    document.getElementById('output').innerText = "서버와 연결되었습니다!";
};

ws.onmessage = (event) => {
    console.log(`서버 응답: ${event.data}`);
    document.getElementById('output').innerText = `서버 응답: ${event.data}`;
};

function sendMessage() {
    const msg = document.getElementById('message').value;
    ws.send(msg);
}
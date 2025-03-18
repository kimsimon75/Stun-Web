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

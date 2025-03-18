const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();
app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html");
})


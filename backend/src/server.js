const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080  });

wss.on('connection', (ws) => {
    ws.on('error', (err) => console.log(err));

    ws.on('message', (data) => {
        wss.clients.forEach((client) => client.send(data.toString()))
    });

    console.log('client connected');
})
const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocket.Server({ port: process.env.PORT || 8080  });

wss.on('connection', (ws) => {
    ws.on('error', (err) => console.log(err));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'login') {
            ws.userName = data.userName;

            ws.send(JSON.stringify({
                type: 'welcome',
                message: `Welcome to the chat, ${data.userName}!`,
                userName: data.userName,
                messageTime: new Date().toLocaleTimeString('pt-BR')
            }));

            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'newUser',
                        message: `${data.userName} has just joined the chat!`,
                        userName: data.userName,
                        messageTime: new Date().toLocaleTimeString('pt-BR')
                    }));
                }
            });
        } else if (data.type === 'message') {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        }
    });


    ws.on('close', () => {
        console.log('client disconnected');
    })

    console.log('client connected');
})

console.log(`the wss is listening at port ${process.env.PORT}`);

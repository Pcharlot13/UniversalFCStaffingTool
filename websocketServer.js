const os = require('os');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', message => {
        // Broadcast the message to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.send('Connected to WebSocket server');
});

app.get('/get-lan-ip', (req, res) => {
    const interfaces = os.networkInterfaces();
    let lanIpAddress = '127.0.0.1'; // Default to localhost

    for (let iface in interfaces) {
        for (let alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                lanIpAddress = alias.address;
                break;
            }
        }
    }

    res.json({ lanIpAddress });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

console.log('WebSocket server is running on ws://localhost:8080');

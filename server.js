const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('trigger-video', (filename) => {
        io.emit('play-video', filename);
    });

    socket.on('video-switched', (data) => {
        io.emit('video-switched-ack', data);
    });

    // Quando o display avisa que o vídeo acabou, propaga para o painel avançar a fila
    socket.on('video-ended', () => {
        io.emit('next-auto-video');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

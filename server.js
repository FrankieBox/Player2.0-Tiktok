const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`[Conexão] Cliente conectado: ${socket.id}`);

    socket.on('trigger-video', (filename) => {
        io.emit('play-video', filename);
    });

    // Recebe a confirmação do display e avisa o painel de controlo com a latência
    socket.on('video-switched', (data) => {
        io.emit('video-switched-ack', data);
    });

    socket.on('disconnect', () => {
        console.log(`[Desconexão] Cliente desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Servidor] Rodando na porta ${PORT}`);
});

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

    // Retransmite o comando de vídeo para o display
    socket.on('trigger-video', (filename) => {
        console.log(`[Servidor] A disparar vídeo: ${filename}`);
        io.emit('play-video', filename);
    });

    // Retransmite o comando de mudança de moldura
    socket.on('change-moldura', (molduraClass) => {
        console.log(`[Servidor] A alterar moldura para: ${molduraClass}`);
        io.emit('change-moldura', molduraClass);
    });

    // Recebe confirmação de latência do display e avisa o painel
    socket.on('video-switched', (data) => {
        io.emit('video-switched-ack', data);
    });

    // Sinal de fim de vídeo para avançar o Auto-Live
    socket.on('video-ended', () => {
        io.emit('next-auto-video');
    });

    socket.on('disconnect', () => {
        console.log(`[Desconexão] Cliente desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Servidor] Rodando na porta ${PORT}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir a pasta 'public' de forma estática (o Express já lida com Range Requests para MP4/MP3)
app.use(express.static(path.join(__dirname, 'public')));

// Rota de segurança para garantir a entrega correta da pasta assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

io.on('connection', (socket) => {
    console.log('[Servidor] Novo cliente conectado:', socket.id);

    // Controlo de Takes de Vídeo do Avatar
    socket.on('trigger-video', (fileName) => {
        io.emit('play-video', fileName);
    });

    socket.on('video-switched', (data) => {
        io.emit('update-status', data);
    });

    // Controlo de Escala / PIP do Avatar
    socket.on('change-scale', (scaleClass) => {
        io.emit('change-scale', scaleClass);
    });

    // Controlo de Fila de Áudio (MP3 / Streaming)
    socket.on('trigger-audio', (audioData) => {
        io.emit('play-audio', audioData);
    });

    socket.on('disconnect', () => {
        console.log('[Servidor] Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Servidor] Estúdio Mobile a rodar na porta ${PORT}`);
});

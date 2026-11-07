const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configura os ficheiros estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota explícita para o Painel Central (Início)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota explícita e forçada para o Display do Avatar
app.get('/display-avatar.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'public', 'display-avatar.html'));
});

// Rota explícita e forçada para o Painel de Controlo
app.get('/control-avatar.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'public', 'control-avatar.html'));
});

io.on('connection', (socket) => {
    console.log(`[Conexão] Cliente conectado: ${socket.id}`);

    socket.on('trigger-video', (filename) => {
        console.log(`[Servidor] A disparar vídeo: ${filename}`);
        io.emit('play-video', filename);
    });

    socket.on('change-scale', (scaleClass) => {
        console.log(`[Servidor] A alterar escala para: ${scaleClass}`);
        io.emit('change-scale', scaleClass);
    });

    socket.on('play-audio-item', (audioData) => {
        console.log(`[Servidor] A transmitir áudio da fila: ${audioData.name}`);
        io.emit('play-audio', audioData);
    });

    socket.on('video-switched', (data) => {
        io.emit('video-switched-ack', data);
    });

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

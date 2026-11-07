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

    // Retransmite o vídeo selecionado para o display
    socket.on('trigger-video', (filename) => {
        io.emit('play-video', filename);
    });

    // Retransmite a escala/tamanho do PIP para o display
    socket.on('change-scale', (scaleClass) => {
        io.emit('change-scale', scaleClass);
    });

    // Retransmite o áudio da fila (envia o URL/Buffer temporário para o Display tocar)
    socket.on('play-audio-item', (audioData) => {
        console.log(`[Servidor] A transmitir áudio da fila: ${audioData.name}`);
        io.emit('play-audio', audioData);
    });

    // Confirmação de latência do display para o painel
    socket.on('video-switched', (data) => {
        io.emit('video-switched-ack', data);
    });

    // Fim do take atual para avançar o Auto-Live
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

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir ficheiros estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`[Conexão] Novo cliente conectado: ${socket.id}`);

    // Recebe o comando do painel de controlo e retransmite para todos os displays
    socket.on('trigger-video', (filename) => {
        console.log(`[Servidor] Comando recebido para reproduzir: ${filename}`);
        io.emit('play-video', filename);
    });

    socket.on('disconnect', () => {
        console.log(`[Desconexão] Cliente desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Servidor] Rodando na porta ${PORT}`);
});

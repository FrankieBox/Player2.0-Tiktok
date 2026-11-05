const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Ouve o painel de controlo e retransmite para o display
    socket.on('control-avatar', (data) => {
        console.log('Comando recebido do controle:', data);
        io.emit('update-avatar', data); // Envia para todas as telas abertas (displays)
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

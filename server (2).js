const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Recebe o comando do controle e envia para o display
    socket.on('control-avatar', (data) => {
        io.emit('update-avatar', data);
    });

    // Sensor: Recebe a confirmação do display e avisa o painel de controle
    socket.on('sensor-ack', () => {
        io.emit('sensor-ack');
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

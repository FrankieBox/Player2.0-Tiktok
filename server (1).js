const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir ficheiros estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Comunicação em Tempo Real via WebSockets
io.on('connection', (socket) => {
    console.log(`Novo cliente ligado: ${socket.id}`);

    // Canal 1: Comandos do Avatar (Estados, Troca de Vídeos, Escala/Zoom)
    socket.on('avatar-command', (data) => {
        // Reencaminha o comando exclusivamente para o Display do Canal 1
        io.emit('update-avatar', data);
    });

    // Canal 2: Comandos de Widgets e Produtos (Subdisplays)
    socket.on('widget-command', (data) => {
        // Reencaminha o comando exclusivamente para o Display do Canal 2
        io.emit('update-widgets', data);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desligado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor autónomo a correr na porta ${PORT}`);
});

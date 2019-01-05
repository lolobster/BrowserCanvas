const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

const colors = { 
    red: "\x1b[31m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m"
}

let server = http.createServer(app);
let io = socketIo.listen(server);
server.listen(8080);

app.use(express.static(__dirname + '/public'));
console.log(colors.cyan, "Server running on 127.0.0.1:8080");

var line_history = [];

io.on('connection', function (socket) {
    console.log(colors.green, "New connection");

    for (let i in line_history) {
        socket.emit('draw_line', { line: line_history[i] });
    }

    socket.on('draw_line', function(data) {
        console.log(colors.yellow, "x:", data.line[0].x, "y:", data.line[0].y);

        // Add received line to history
        line_history.push(data.line);

        // Send line to all clients
        io.emit('draw_line', { line: data.line });
    });
});
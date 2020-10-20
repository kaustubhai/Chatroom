const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const port = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

var count = 0;

io.on('connect', (socket) => {
    io.emit('NewUser')
    socket.emit('Welcome')

    socket.on('newMessage', (message) => {
        io.emit('recieved', message)
    })
})


server.listen(port)
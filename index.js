const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words')

const port = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

var count = 0;

io.on('connect', (socket) => {
    console.log('Socket connected')
    socket.broadcast.emit('botMsg', 'A User connected')

    socket.on('newMessage', (message, cb) => {
        const filter = new Filter();
        if (filter.isProfane(message))
            return socket.emit('botMsg', 'Profanity is not allowed')
        io.emit('recieved', message)
        cb('Delivered')
    })

    socket.on('locationCords', (latitude, longitude, cb) => {
        socket.broadcast.emit('botMsg', `https://google.co.in/maps?q=${latitude},${longitude}`)
        cb()
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('botMsg', 'A User disconnected')
    })
})


server.listen(port)
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { convertToMessage } = require('./utils/generateMessages');

const port = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connect', (socket) => {
    console.log('Socket connected')
    socket.broadcast.emit('botMsg', convertToMessage('A User connected'))

    socket.on('newMessage', (message, cb) => {
        const filter = new Filter();
        if (filter.isProfane(message))
            socket.emit('botMsg', convertToMessage('Profanity is not allowed'))
        else
            io.emit('recieved', convertToMessage(message))
        cb('Delivered')
    })

    socket.on('locationCords', (latitude, longitude, cb) => {
        io.emit('loc', `https://google.co.in/maps?q=${latitude},${longitude}`)
        cb()
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('botMsg', convertToMessage('A User disconnected'))
    })
})


server.listen(port)
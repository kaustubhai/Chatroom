const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { convertToMessage } = require('./utils/generateMessages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const port = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connect', (socket) => {
    console.log('Socket connected')

    socket.on('join', (qs, cb) => {
        const user = addUser({ id: socket.id, username: qs.username, roomname: qs.roomname })
        if (user.error)
            cb(user.error);
        socket.join(user.roomname)
        socket.broadcast.to(user.roomname).emit('recieved', convertToMessage(`${user.username} has joined the chat`))

        io.to(user.roomname).emit('roomData', {
            roomname: user.roomname,
            users: getUsersInRoom(user.roomname)
        })
    })

    socket.on('newMessage', (message, cb) => {
        const user = getUser(socket.id)
        const filter = new Filter();
        if (filter.isProfane(message))
            socket.emit('recieved', convertToMessage('Profanity is not allowed'))
        else
            io.to(user.roomname).emit('recieved', convertToMessage(message, user.username))
        cb('Delivered')
    })

    socket.on('locationCords', (latitude, longitude, cb) => {
        const user = getUser(socket.id)
        io.to(user.roomname).emit('loc', convertToMessage(`https://google.co.in/maps?q=${latitude},${longitude}`, user.username))
        cb()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.roomname).emit('recieved', convertToMessage(`${user.username} disconnected`))

            io.to(user.roomname).emit('roomData', {
                roomname: user.roomname,
                users: getUsersInRoom(user.roomname)
            })
        }
    })
})


server.listen(port)
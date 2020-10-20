const socket = io()

socket.on('NewUser', () => {
    console.log('New User Connected to the chat')
})

socket.on('Welcome', (count) => {
    console.log('Welcome to the chat')
})

socket.on('recieved', (message) => {
    console.log(message)
})

document.getElementById('chatBox').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = document.getElementById('message').value
    console.log(1)
    socket.emit('newMessage', message)
})
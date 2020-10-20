const socket = io()

socket.on('botMsg', (msg) => {
    console.log(msg)
})

socket.on('recieved', (message) => {
    console.log(message)
})

document.getElementById('chatBox').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = document.getElementById('message').value
    socket.emit('newMessage', message, (msg) => {
        console.log(msg)
    })
})

document.getElementById('send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return console.log('Geolocation is not supported')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('locationCords', position.coords.latitude, position.coords.longitude, () => {
            console.log('Location shared')
        })
    })
})
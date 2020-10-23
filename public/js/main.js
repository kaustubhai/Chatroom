const socket = io()

//elements
const $form = document.getElementById('chatBox')
const $msg = document.getElementById('message')
const $but = document.getElementById('submitButton')
const $loc = document.getElementById('send-location')
const $msgs = document.getElementById('messages')
//templates
const $msgTemplate = document.getElementById('message-template').innerHTML;
const $locTemplate = document.getElementById('location-template').innerHTML;
//queries
const qs = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('botMsg', (msg) => {
    console.log(msg.text, 'at', msg.time)
})

socket.on('recieved', (message) => {
    const html = Mustache.render($msgTemplate, {
        message: message.text,
        createdAt: moment(message.time).format('HH:MM')
    })
    $msgs.insertAdjacentHTML('beforeend', html)
})

socket.on('loc', (locationMessage) => {
    const html = Mustache.render($locTemplate, {
        locationMessage
    })
    $msgs.insertAdjacentHTML('beforeend', html)
    console.log(qs)
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    $but.setAttribute('disabled', 'disabled')
    const message = $msg.value
    $msg.value = ""
    socket.emit('newMessage', message, (msg) => {
        $but.removeAttribute('disabled')
        $msg.focus()
    })
})

$loc.addEventListener('click', () => {
    $loc.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation)
        return console.log('Geolocation is not supported')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('locationCords', position.coords.latitude, position.coords.longitude, () => {
            $loc.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

socket.emit('join', qs)
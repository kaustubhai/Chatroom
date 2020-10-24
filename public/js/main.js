const socket = io()

//elements
const $form = document.getElementById('chatBox')
const $msg = document.getElementById('message')
const $but = document.getElementById('submitButton')
const $loc = document.getElementById('send-location')
const $msgs = document.getElementById('messages')
const $side = document.getElementById('sidebar')
//templates
const $msgTemplate = document.getElementById('message-template').innerHTML;
const $locTemplate = document.getElementById('location-template').innerHTML;
const $sidTemplate = document.getElementById('sidebar-template').innerHTML;
//queries
const qs = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // //latest message
    // $newMsg = $msgs.lastElementChild

    // //height of the new message
    // const $newMsgStyles = getComputedStyle($newMsg)
    // const $newMsgMargin = parseInt($newMsgStyles.marginBottom)
    // const $newMsgHeight = $newMsg.offsetHeight + $newMsgMargin

    // //visible height
    // const $visible = $msgs.offsetHeight

    // //height of the container of msgs
    // const $container = $msgs.scrollHeight

    // //scrolled height
    // const $scrollOffset = $msgs.scrollTop + $visible

    // if ($container - $newMsgHeight <= $scrollOffset)
    $msgs.scrollTop = $msgs.scrollHeight
}

socket.on('recieved', (message) => {
    const html = Mustache.render($msgTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.time).format('HH:MM')
    })
    $msgs.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('loc', (locationMessage) => {
    const html = Mustache.render($locTemplate, {
        username: locationMessage.username,
        locationMessage,
        createdAt: moment(locationMessage.time).format('HH:MM')
    })
    $msgs.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', (roomData) => {
    const html = Mustache.render($sidTemplate, {
        room: roomData.roomname,
        users: roomData.users
    })
    $side.innerHTML = html
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

socket.emit('join', qs, (error) => {
    alert(error)
    location.href = '/'
})
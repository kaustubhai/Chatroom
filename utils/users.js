users = []

const addUser = ({ id, username, roomname }) => {
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()

    const existingUser = users.find((user) => {
            return user.username === username && user.roomname === roomname
        })

    if (existingUser) {
        return {
            error: 'User Already Exists'
        }
    }

    const user = { id, username, roomname }
    users.push(user)
    return user
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index > -1)
        return users.splice(index, 1)[0]
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id)
    return user
}

const getUsersInRoom = (room) => {
    const user = users.filter((user) => user.roomname === room)
    return user
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}
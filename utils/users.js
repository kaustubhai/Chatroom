users = []

const addUser = ({ id, username, roomname }) => {
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()

    const existingUser = () => {
        users.find((user) => {
            return user.username === username && user.roomname === roomname
        })
    }

    if (existingUser){
        return {
            error: 'User Already Exists'
        }
    }

    const user = { id, username, roomname }
    users.push(user)
    return user
}

addUser({
    id: 12,
    username: 'kaustubh',
    roomname: 'hello'
})
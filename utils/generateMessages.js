const convertToMessage = (text, username) => {
    return {
        text,
        time: new Date().getTime(),
        username: username || 'Admin Chat App'
    }
}

module.exports = {
    convertToMessage
}
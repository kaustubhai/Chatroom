const convertToMessage = (text) => {
    return {
        text,
        time: new Date().getTime()
    }
}

module.exports = {
    convertToMessage
}
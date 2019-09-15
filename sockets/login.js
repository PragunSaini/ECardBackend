// Socket that sends user info back to client
const userHandler = require('../models/userHandler')

const loginSocket = socket => {
    const user = userHandler.getUserInfo(socket.id)
    socket.emit('user information', user)
}

module.exports = loginSocket

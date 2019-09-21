const userHandler = require('../models/userHandler')

// Upon authentication send the user info to client
const loginSocket = socket => {
    const user = userHandler.getUserInfo(socket.id)
    // eslint-disable-next-line
    socket.user = user
    socket.emit('user information', user)
}

module.exports = loginSocket

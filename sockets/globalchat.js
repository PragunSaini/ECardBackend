// Handles socket interaction for the global chat
const userHandler = require('../models/userHandler')
const logger = require('../utils/logger')

const globalchatSocket = socket => {
    // Send the current connected players count
    socket.emit('connected count', userHandler.getUserCount())

    // receive the chat sent by this socket
    socket.on('global chat message', msg => {
        logger.info(msg)
        // send this user's message to all other users
        socket.broadcast.emit('global chat broadcast', msg)
    })
}

module.exports = globalchatSocket

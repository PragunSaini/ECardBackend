// Initializes sockets in the app
const socketIO = require('socket.io')

const logger = require('./utils/logger')

// Import custom socket handlers here
const loginSocket = require('./sockets/login')

const socketInit = server => {
    const io = socketIO(server)
    io.on('connection', socket => {
        logger.info('New Connection')
        loginSocket(socket)
    })
}

module.exports = { socketInit }

// Initializes sockets in the app
const socketIO = require('socket.io')

const logger = require('./utils/logger')

// Import custom socket handlers here
const helloSocket = require('./sockets/hello')

const socketInit = server => {
    const io = socketIO(server)
    io.on('connection', socket => {
        logger.info('New connection')
        helloSocket(socket)
    })
}

module.exports = { socketInit }

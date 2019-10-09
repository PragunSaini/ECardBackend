// Initializes and authenticates sockets in the app
const socketIO = require('socket.io')
const socketAuth = require('socketio-auth')

const userHandler = require('./models/userHandler')
const logger = require('./utils/logger')

const loginSocket = require('./sockets/login')
const globalchatSocket = require('./sockets/globalchat')
const roomSocket = require('./sockets/rooms')
const gameSocket = require('./sockets/game')

// Initialize the socket
const socketInit = server => {
    const io = socketIO(server)
    // Perform authentication
    socketAuth(io, {
        authenticate: async (socket, data, callback) => {
            logger.info('***** AUTHENTICATING***** : ', data)
            try {
                if (data.guest) {
                    const user = userHandler.addGuestUser(socket.id, data.uid, data.displayName)
                    if (user) callback(null, true)
                } else {
                    const user = await userHandler.addLoggedInUser(socket.id, data.uid)
                    if (user) callback(null, true)
                }
            } catch (error) {
                callback(error)
            }
        },
        postAuthenticate: (socket, data) => {
            logger.info(`Socket ${socket.id} - ${data.uid} has been connected`)
            io.emit('connected count', userHandler.getUserCount())
            // Socket handlers attached here
            loginSocket(socket)
            globalchatSocket(socket)
            roomSocket(socket)
            gameSocket(socket)
        },
        disconnect: socket => {
            userHandler.disconnectUser(socket.id)
            logger.info(socket.id, 'disconnected')
            io.emit('connected count', userHandler.getUserCount())
        },
        timeout: 10000 // wait 1 day for authentication then disconnect if not done
    })
}

module.exports = { socketInit }

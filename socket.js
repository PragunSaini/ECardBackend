// Initializes and authenticates sockets in the app
const socketIO = require('socket.io')
const socketAuth = require('socketio-auth')

const userHandler = require('./models/userHandler')
const logger = require('./utils/logger')

const loginSocket = require('./sockets/login')

// Initialize the socket
const socketInit = server => {
    const io = socketIO(server)
    // Perform authentication
    socketAuth(io, {
        authenticate: async (socket, data, callback) => {
            console.log('***** AUTHENTICATING***** : ', data)
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
            // Socket handlers attached here
            loginSocket(socket)
        },
        disconnect: socket => {
            userHandler.disconnectUser(socket.id)
            logger.info(socket.id, 'disconnected')
        },
        timeout: 86400000 // wait 1 day for authentication then disconnect if not done
    })
}


module.exports = { socketInit }

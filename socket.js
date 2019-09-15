// Initializes sockets in the app
const socketIO = require('socket.io')
const socketAuth = require('socketio-auth')

// const logger = require('./utils/logger')

// Import custom socket handlers here
const loginSocket = require('./sockets/login')
const userHandler = require('./models/userHandler')

// Initialize the socket
const socketInit = server => {
    const io = socketIO(server)
    // Perform authentication
    socketAuth(io, {
        authenticate: async (socket, data, callback) => {
            console.log('AUTHENTICATING', data)
            const { uid } = data
            try {
                const user = await userHandler.addLoggedInUser(socket.id, uid)
                if (user) callback(null, true)
            } catch (error) {
                callback(error)
            }
        },
        postAuthenticate: (socket, data) => {
            console.log(`Socket ${socket.id} - ${data.uid} has been connected`)
            // Socket handlers attached here
            loginSocket(socket)
        },
        disconnect: socket => {
            console.log(socket.id, 'disconnected')
        },
        timeout: 5000
    })
}

module.exports = { socketInit }

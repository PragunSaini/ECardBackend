// Initializes sockets in the app
const socketIO = require('socket.io')
const socketAuth = require('socketio-auth')

// const logger = require('./utils/logger')

// Import custom socket handlers here
// const loginSocket = require('./sockets/login')
const userHandler = require('./models/userHandler')

// Initialize the socket
const socketInit = server => {
    const io = socketIO(server)
    // Perform authentication
    socketAuth(io, {
        authenticate: async (socket, data, callback) => {
            console.log('AUTHENTICATING', data)
            const { email } = data
            if (await userHandler.loginUser(socket.id, email)) {
                callback(null, true)
            } else {
                callback(new Error(`Can't login User`))
            }
        },
        postAuthenticate: (socket, data) => {
            console.log(`Socket ${socket.id} - ${data.email} has been connected`)
        },
        disconnect: socket => {
            console.log(socket.id, 'disconnected')
        },
        timeout: 2000
    })

    io.on('connection', socket => {
        console.log('NEW CONNECTION YIIPEE')
        socket.on('send back', () => {
            socket.emit('msg', { name: 'ASSHOLE' })
        })
    })
}

module.exports = { socketInit }

// Entry point for the backend

const http = require('http')
const socketIO = require('socket.io')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Create the http server
const server = http.createServer(app)

// Attach socket in app
const io = socketIO(server)

// Start the server
server.listen(config.PORT, () => {
    logger.logger('Server running on PORT ', config.PORT)
})

io.on('connection', socket => {
    logger.info('New connection')
    socket.emit('msg', { hello: 'world' })
})

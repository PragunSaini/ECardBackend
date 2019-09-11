// Entry point for the backend

const http = require('http')

const app = require('./app')
const socket = require('./socket')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Create the http server
const server = http.createServer(app)

// Attach socket in app
socket.socketInit(server)

// Start the server
server.listen(config.PORT, () => {
    logger.logger('Server running on PORT ', config.PORT)
})

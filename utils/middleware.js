// Custom middleware definitions
const logger = require('./logger')

// Log request information
const requestLogger = (req, res, next) => {
    logger.info('Method : ', req.method)
    logger.info('Path : ', req.path)
    logger.info('Body : ', req.body)
    next()
}

// Handles wrong endpoints
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Not Found, Unknown endpoint' })
}

module.exports = {
    requestLogger,
    unknownEndpoint
}

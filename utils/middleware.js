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

// Handles specific errors
const errorHandler = (error, req, res, next) => {
    logger.error(error)

    if (error.code === 'auth/invalid-password') {
        res.status(400).send({
            code: error.code,
            message: error.message
        })
    }
    if (error.code === 'auth/email-already-exists') {
        res.status(400).send({
            code: error.code,
            message: error.message
        })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}

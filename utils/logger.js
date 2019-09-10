// Logger to handle console outputs

// Doesn't print while testing
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

// Print everytime
const logger = (...params) => {
    console.log(...params)
}

// Print errors, everytime
const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info,
    logger,
    error
}

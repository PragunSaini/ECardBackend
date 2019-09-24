// Logger to handle console outputs
const chalk = require('chalk')

// Doesn't print while testing
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(chalk.green(...params))
    }
}

// Print everytime
const logger = (...params) => {
    console.log(chalk.yellowBright(...params))
}

// Print errors, everytime
const error = (...params) => {
    console.error(chalk.red(...params))
}

module.exports = {
    info,
    logger,
    error
}

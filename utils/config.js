// Environment variables config

// Loads the .env file into process.env object
require('dotenv').config()

// Using object destructuring
const { PORT } = process.env

module.exports = {
    PORT
}

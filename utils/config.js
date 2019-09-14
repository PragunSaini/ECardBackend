// Environment variables config

// Loads the .env file into process.env object
require('dotenv').config()

// Using object destructuring
const { PORT } = process.env
// Your firebase app private key
const FIREBASE_SERVICE_ACCOUNT = require('../firebaseprivatekey.json')

module.exports = {
    PORT,
    FIREBASE_SERVICE_ACCOUNT
}

// Express app
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const middleware = require('./utils/middleware')

// Intitialize express app
const app = express()

// Deploy middleware
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

// Listen to routes here
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'))
})

// Deploy error handling middleware
app.use(middleware.unknownEndpoint)

module.exports = app

// Express app
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const middleware = require('./utils/middleware')
const registerRouter = require('./controllers/register')

// Intitialize express app
const app = express()

// Deploy middleware
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

// Listen to routes here
app.use('/', registerRouter)

// If no particular route matches
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'))
})

// Deploy error handling middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

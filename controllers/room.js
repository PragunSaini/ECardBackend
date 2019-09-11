const roomRouter = require('express').Router()

roomRouter.get('/apple', (req, res) => {
    res.send('Hello World')
})

module.exports = roomRouter

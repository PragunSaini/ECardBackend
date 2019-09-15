const registerRouter = require('express').Router()
const userHandler = require('../models/userHandler')

// Register a new user and send back the information
registerRouter.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body
    try {
        const user = await userHandler.registerUser(email, username, password)
        res.json(user)
    } catch (error) {
        next(error)
    }
})

module.exports = registerRouter

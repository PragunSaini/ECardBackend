const registerRouter = require('express').Router()
const userHandler = require('../models/userHandler')

registerRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const user = await userHandler.registerUser(email, username, password)
        res.json(user)
    } catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = registerRouter

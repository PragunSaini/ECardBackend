const registerRouter = require('express').Router()
const userHandler = require('../models/userHandler')

registerRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    const user = await userHandler.registerUser(email, username, password)
    console.log(user)
    if (user === null) {
        res.status(400).json({ error: `Can't register user` })
    } else {
        res.json(user)
    }
})

module.exports = registerRouter

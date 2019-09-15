const firebaseAuth = require('./firebaseAuth')
const logger = require('../utils/logger')

// Handles the currently connected users
// Only connected after login
let connectedUsers = []

// Register a new user using firebase
const registerUser = async (email, username, password) => {
    const user = await firebaseAuth.registerUser(email, username, password)
    return user
}

// Add logged in user's info to connectUsers
// Log-in is handled client-side using firebase
const addLoggedInUser = async (socketid, uid) => {
    const user = await firebaseAuth.getUserData(uid)
    user.socketid = socketid
    connectedUsers.push(user)
    logger.info('==> Currently connected users  => ', connectedUsers.length)
    return user
}

// Retrieve this socket's information and send back
const getUserInfo = socketid => {
    return connectedUsers.find(user => user.socketid === socketid)
}

// Remove a user from list upon disconnect
const disconnectUser = socketid => {
    connectedUsers = connectedUsers.filter(user => user.socketid !== socketid)
    logger.info('==> Currently connected users  => ', connectedUsers.length)
}

module.exports = {
    registerUser,
    addLoggedInUser,
    getUserInfo,
    disconnectUser
}

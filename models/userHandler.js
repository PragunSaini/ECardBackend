const firebaseAuth = require('./firebaseAuth')
const logger = require('../utils/logger')

// Handles the currently connected users
// Only connected after login
const connectedUsers = []

// Register a new user using firebase
const registerUser = async (email, username, password) => {
    try {
        const user = await firebaseAuth.registerUser(email, username, password)
        return user
    } catch (error) {
        logger.error(error)
        return error
    }
}

// Add logged in user's info to connectUsers
// Log-in is handled client-side using firebase
const addLoggedInUser = async (socketid, uid) => {
    try {
        const user = await firebaseAuth.getUserData(uid)
        user.socketid = socketid
        connectedUsers.push(user)
        return user
    } catch (error) {
        logger.error(error)
        throw error
    }
}

// Retrieve this socket's information and send back
const getUserInfo = socketid => {
    return connectedUsers.find(user => user.socketid === socketid)
}

module.exports = {
    registerUser,
    addLoggedInUser,
    getUserInfo
}

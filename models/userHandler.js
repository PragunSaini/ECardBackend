const firebaseAuth = require('./firebaseAuth')
const logger = require('../utils/logger')

const userInfo = []

const registerUser = async (email, username, password) => {
    try {
        const user = await firebaseAuth.registerUser(email, username, password)
        return user
    } catch (error) {
        logger.error(error)
        return null
    }
}

const loginUser = async (id, email) => {
    try {
        const user = await firebaseAuth.login(email)
        if (user.uid !== null) {
            userInfo.push({ ...user, id })
            return true
        }
        return false
    } catch (error) {
        logger.error(`Can't authenticate user`)
        return false
    }
}

const getUserInfo = id => {
    return userInfo.find(user => user.id === id)
}

module.exports = {
    // setId,
    registerUser,
    loginUser,
    getUserInfo
}

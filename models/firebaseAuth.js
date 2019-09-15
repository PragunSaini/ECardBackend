const admin = require('firebase-admin')

const logger = require('../utils/logger')

// Your app's private key
const { FIREBASE_SERVICE_ACCOUNT } = require('../utils/config')

// Initialize Firebase SDK
admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
    databaseURL: 'https://e-card-9955f.firebaseio.com'
})

// THIS MODULE CONTAINS FUNTIONS TO QUERY THE FIREBASE DATABASE
// THEY DO NOT CHANGE THE STATE OF THE SERVER IN ANY WAY

// Register a new user
const registerUser = async (email, username, password) => {
    try {
        const user = await admin.auth().createUser({
            email,
            displayName: username,
            password // firebase hashes passwords cloud-side
        })
        return user
    } catch (error) {
        logger.error('**** Error in firebaseAuth **** : ', error)
        throw error
    }
}

// Get user's details using uid
const getUserData = async uid => {
    try {
        const user = await admin.auth().getUser(uid)
        return user.toJSON()
    } catch (error) {
        logger.error('**** Error in firebaseAuth **** : ', error)
        throw error
    }
}

module.exports = {
    registerUser,
    getUserData
}

const admin = require('firebase-admin')

// Your app's private key
const { FIREBASE_SERVICE_ACCOUNT } = require('../utils/config')

// Initialize Firebase SDK
admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
    databaseURL: 'https://e-card-9955f.firebaseio.com'
})

const registerUser = async (email, username, password) => {
    try {
        const user = await admin.auth().createUser({
            email,
            displayName: username,
            password // firebase hashes passwords cloud-side
        })
        return user
    } catch (error) {
        console.log(error)
        return error
    }
}

const login = async email => {
    const userRecord = await admin.auth().getUserByEmail(email)
    const user = userRecord.toJSON()
    if (user) {
        console.log(user)
        return user
    }
    return { uid: null }
}

module.exports = {
    registerUser,
    login
}

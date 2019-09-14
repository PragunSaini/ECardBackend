// Socket that handles setting user info

const userInfo = require('../models/userInfo')

const loginSocket = socket => {
    // Set the socket id
    userInfo.setId(socket.id)

    // Set username recieved from client
    socket.on('set username', name => {
        console.log(name)
        userInfo.setUserName(name)
        // Send the user object back to client
        socket.emit('user info', userInfo.getUserInfo())
    })
}

module.exports = loginSocket

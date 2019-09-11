// Socket that handles new connections

const rooms = []

const helloSocket = socket => {
    const userInfo = {}
    userInfo.id = socket.id

    socket.emit('msg', { id: socket.id })

    socket.on('join room', id => {
        console.log(`Room id ${id}`)
        socket.join(id)
        userInfo.roomID = id
        if (!rooms.some(room => room === id)) {
            rooms.push(id)
        }
        console.log(rooms)
        console.log(userInfo)
    })

    socket.on('chatmsg', msg => {
        socket.to(userInfo.roomID).broadcast.emit('addChatMessage', msg)
    })
}

module.exports = helloSocket

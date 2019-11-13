// Handles room creation for a gaming session
const roomsHandler = require('../models/roomsHandler')

const roomIDGenerator = () => {
    const newRoomID = Math.floor(100000 + Math.random() * 900000)
    if (roomsHandler.existsRoom(newRoomID)) {
        return roomIDGenerator()
    }
    return newRoomID
}

const roomSocket = (socket, io) => {
    // Create a new room
    socket.on('create game room', () => {
        const newRoomID = roomIDGenerator()
        // Store the ids of players
        const newRoom = {
            roomid: newRoomID,
            player1SocketID: socket.id,
            player1UID: socket.user.uid,
            player1Ready: false,
            player2SocketID: null,
            player2UID: null,
            player2Ready: false
        }
        roomsHandler.addNewRoom(newRoom)
        // Actually join the room
        socket.join(`${newRoomID}`)
        // eslint-disable-next-line
        socket.roomid = newRoomID
        // Tell the client about success
        socket.emit('game room created', newRoom)
    })

    // Join a existing room
    socket.on('join game room', roomid => {
        // Check if that room already full or doesn't exist
        const room = roomsHandler.getRoom(roomid)
        if (room === undefined) {
            socket.emit('no such room')
        } else if (room.player2SocketID !== null) {
            socket.emit('room full')
        } else if (room.player1SocketID === socket.id) {
            socket.emit('cannot join own room')
        } else {
            // Room can be joined so join it
            const modifiedRoom = { ...room }
            socket.roomid = modifiedRoom.roomid
            socket.join(`${modifiedRoom.roomid}`)
            modifiedRoom.player2SocketID = socket.id
            modifiedRoom.player2UID = socket.user.uid
            // notify client
            socket.to(`${modifiedRoom.roomid}`).emit('game room joined', modifiedRoom)
            socket.emit('game room joined', modifiedRoom)
            roomsHandler.setRoom(modifiedRoom)
        }
    })

    // Handle room chats
    socket.on('room chat message', msg => {
        io.to(socket.roomid).emit('room chat msg gotten', msg)
    })

    // handle room deletion
    socket.on('erase game room', roomid => {
        roomsHandler.eraseRoom(roomid)
    })
}

module.exports = roomSocket

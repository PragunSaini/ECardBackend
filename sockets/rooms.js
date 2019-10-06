// Handles room creation for a gaming session

// Store all the rooms
let rooms = []

const roomIDGenerator = () => {
    const newRoomID = Math.floor(100000 + Math.random() * 900000)
    if (rooms.some(room => room.roomid === newRoomID)) {
        return roomIDGenerator()
    }
    return newRoomID
}

const roomSocket = socket => {
    // Create a new room
    socket.on('create game room', () => {
        console.log('REQUEST RECIEVED')
        const newRoomID = roomIDGenerator()
        // Store the ids of players
        const newRoom = {
            roomid: newRoomID,
            player1SocketID: socket.id,
            player1UID: socket.user.uid,
            player2SocketID: null,
            player2UID: null
        }
        rooms = [...rooms, newRoom]
        // Actually join the room
        socket.join(`${newRoomID}`)
        // eslint-disable-next-line
        socket.roomid = newRoomID
        // Tell the client about success
        console.log('EMITTING ', newRoom)
        socket.emit('game room created', newRoom)
    })

    // Join a existing room
    socket.on('join game room', roomid => {
        console.log(roomid, 'JOIN ME')
        // Check if that room already full or doesn't exist
        const room = rooms.find(r => r.roomid === roomid)
        if (room === undefined) {
            console.log('ROOM NOT EXIST')
            socket.emit('no such room')
        } else if (room.player2SocketID !== null) {
            console.log('ROOM FULL')
            socket.emit('room full')
        } else if (room.player1SocketID === socket.id) {
            socket.emit('cannot join own room')
        } else {
            // Room can be joined so join it
            // eslint-disable-next-line
            socket.roomid = room.roomid
            socket.join(`${room.roomid}`)
            room.player2SocketID = socket.id
            room.player2UID = socket.user.uid
            // Store this altered room
            rooms = rooms.map(r => {
                if (r.roomid === room.roomid) {
                    return room
                }
                return r
            })
            // notify client
            console.log('JOIINNG', room)
            socket.to(`${room.roomid}`).emit('game room joined', room)
            socket.emit('game room joined', room)
        }
    })
}

module.exports = roomSocket

const roomsHandler = require('../models/roomsHandler')

const gameSocket = socket => {
    // Game ready to play request by a player
    socket.on('ready to play', roomid => {
        const room = roomsHandler.getRoom(roomid)
        if (socket.user.uid == room.player1UID && !room.player1Ready) {
            room.player1Ready = true
        } else if (socket.user.uid == room.player2UID && !room.player2Ready) {
            room.player2Ready = true
        }

        if (room.player1Ready && room.player2Ready) {
            roomsHandler.setRoom(startGame(room))
        }
    })

    const startGame = origRoom => {
        const room = { ...origRoom }
        room.state = {
            round1: [],
            round2: [],
            round3: [],
            round4: []
        }
        room.emperor = null
        room.slave = null
        const toss = Math.floor(Math.random() * 2)
        if (toss == 1) {
            room.emperor = room.player1UID
            room.slave = room.player2UID
        } else {
            room.emperor = room.player2UID
            room.slave = room.player1UID
        }
        socket.nsp.to(room.roomid).emit('game init and start', room)
        return room
    }
}

module.exports = gameSocket

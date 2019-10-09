const roomsHandler = require('../models/roomsHandler')

const gameSocket = (socket, io) => {
    // Game ready to play request by a player
    socket.on('ready to play', roomid => {
        const room = { ...roomsHandler.getRoom(roomid) }
        if (socket.user.uid == room.player1UID && !room.player1Ready) {
            room.player1Ready = true
            roomsHandler.setRoom(room)
        } else if (socket.user.uid == room.player2UID && !room.player2Ready) {
            room.player2Ready = true
            roomsHandler.setRoom(room)
        }
        if (room.player1Ready && room.player2Ready) {
            roomsHandler.setRoom(startGame(roomid))
        }
    })

    const startGame = roomid => {
        const room = { ...roomsHandler.getRoom(roomid) }
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
        io.to(room.roomid).emit('game init and start', room)
        return room
    }
}

module.exports = gameSocket

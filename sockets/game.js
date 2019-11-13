const roomsHandler = require('../models/roomsHandler')
const userHandler = require('../models/userHandler')

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
        room.state = [['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']]
        room.emperor = null
        room.slave = null
        room.player1Played = null
        room.player2Played = null
        room.player1Score = 0
        room.player2Score = 0
        room.lastWon = null
        room.round = 0
        room.stage = 0
        room.gameOver = false
        const toss = Math.floor(Math.random() * 2)
        if (toss == 1) {
            room.emperor = room.player1UID
            room.slave = room.player2UID
        } else {
            room.emperor = room.player2UID
            room.slave = room.player1UID
        }
        room.player1Cards = ['C', 'C', 'C', 'C', room.emperor == room.player1UID ? 'E' : 'S']
        room.player2Cards = ['C', 'C', 'C', 'C', room.emperor == room.player2UID ? 'E' : 'S']
        room.round = 0
        room.stage = 0
        room.turn = 0
        io.to(room.roomid).emit('game init and start', room)
        return room
    }

    const resetRoom = roomid => {
        const room = { ...roomsHandler.getRoom(roomid) }
        room.stage += 1
        if (room.stage == 3) {
            room.round += 1
            room.stage = 0
            const temp = room.emperor
            room.emperor = room.slave
            room.slave = temp
        }
        room.player1Played = null
        room.player2Played = null
        room.player1Cards = ['C', 'C', 'C', 'C', room.emperor == room.player1UID ? 'E' : 'S']
        room.player2Cards = ['C', 'C', 'C', 'C', room.emperor == room.player2UID ? 'E' : 'S']
        room.result = undefined
        roomsHandler.setRoom(room)
    }

    const checkResult = roomid => {
        const room = roomsHandler.getRoom(roomid)
        if (room.player1Played.play == 'C' && room.player2Played.play == 'C') {
            room.player1Cards = [...room.player1Cards].slice(1)
            room.player2Cards = [...room.player2Cards].slice(1)
            if (room.player1Cards.length == 1) {
                room.result = 'Slave wins'
                room.state[room.round][room.stage] = room.slave
                room.lastWon = room.slave
                if (room.slave == room.player1UID) {
                    room.player1Score += 5
                } else {
                    room.player2Score += 5
                }
                roomsHandler.setRoom(room)
                resetRoom(roomid)
            } else {
                room.result = 'DRAW'
                room.player1Played = null
                room.player2Played = null
            }
        } else if (
            (room.player1Played.play == 'S' && room.player2Played.play == 'C') ||
            (room.player1Played.play == 'C' && room.player2Played.play == 'S')
        ) {
            room.state[room.round][room.stage] = room.emperor
            room.lastWon = room.emperor
            room.result = 'Emperor wins'
            if (room.emperor == room.player1UID) {
                room.player1Score += 1
            } else {
                room.player2Score += 1
            }
            roomsHandler.setRoom(room)
            resetRoom(roomid)
        } else if (
            (room.player1Played.play == 'E' && room.player2Played.play == 'C') ||
            (room.player1Played.play == 'C' && room.player2Played.play == 'E')
        ) {
            room.state[room.round][room.stage] = room.emperor
            room.result = 'Emperor wins'
            room.lastWon = room.emperor
            if (room.emperor == room.player1UID) {
                room.player1Score += 1
            } else {
                room.player2Score += 1
            }
            roomsHandler.setRoom(room)
            resetRoom(roomid)
        } else if (
            (room.player1Played.play == 'E' && room.player2Played.play == 'S') ||
            (room.player1Played.play == 'S' && room.player2Played.play == 'E')
        ) {
            room.state[room.round][room.stage] = room.slave
            room.result = 'Slave wins'
            room.lastWon = room.slave
            if (room.slave == room.player1UID) {
                room.player1Score += 5
            } else {
                room.player2Score += 5
            }
            roomsHandler.setRoom(room)
            resetRoom(roomid)
        }

        const newRoom = roomsHandler.getRoom(roomid)
        // console.log(newRoom)
        if (newRoom.stage == 0 && newRoom.round == 4) {
            newRoom.gameOver = true
            io.to(newRoom.roomid).emit('next turn', newRoom)
        } else {
            io.to(newRoom.roomid).emit('next turn', newRoom)
        }
    }

    socket.on('card played', ({ card, roomid }) => {
        const room = { ...roomsHandler.getRoom(roomid) }
        if (socket.user.uid == room.player1UID && !room.player1Played) {
            room.player1Played = { play: card }
            if (!userHandler.getUserInfo(room.player2SocketID)) {
                room.player2UID = null
                room.player2SocketID = null
                room.gameOver = true
            }
            roomsHandler.setRoom(room)
        }
        if (socket.user.uid == room.player2UID && !room.player2Played) {
            room.player2Played = { play: card }
            if (!userHandler.getUserInfo(room.player1SocketID)) {
                room.player1UID = null
                room.player1SocketID = null
                room.gameOver = true
            }
            roomsHandler.setRoom(room)
        }
        console.log(room)
        if (!room.player1SocketID || !room.player2SocketID) {
            io.to(room.roomid).emit('next turn', room)
            return
        }

        if (room.player1Played && room.player2Played) {
            checkResult(roomid)
        }
    })
}

module.exports = gameSocket

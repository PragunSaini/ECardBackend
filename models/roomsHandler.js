// Store all the current game rooms, behaving like hashmap
const gamerooms = {}

// return true if room with that ID already exists
const existsRoom = id => {
    if (typeof gamerooms[id] == 'undefined') {
        return false
    }
    if (gamerooms[id] == null) {
        return false
    }
    return true
}

// Adding a new room to already existing rooms
const addNewRoom = room => {
    gamerooms[room.roomid] = room
}

// Fetching room by roomid
const getRoom = id => {
    return gamerooms[id]
}

const setRoom = room => {
    gamerooms[room.roomid] = room
}

const eraseRoom = id => {
    gamerooms[id] = null
    console.log(gamerooms)
}

module.exports = {
    existsRoom,
    addNewRoom,
    getRoom,
    setRoom,
    eraseRoom
}

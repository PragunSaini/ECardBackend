// Store all the current game rooms, behaving like hashmap
const gamerooms = {}

// return true if room with that ID already exists
const existsRoom = id => {
    if (typeof gamerooms[id] == 'undefined') {
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

module.exports = {
    existsRoom,
    addNewRoom,
    getRoom
}

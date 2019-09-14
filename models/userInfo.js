const userInfo = {}

const setId = id => {
    userInfo.id = id
}

const setUserName = name => {
    userInfo.username = name
}

const getUserInfo = () => {
    return userInfo
}

module.exports = {
    setId,
    setUserName,
    getUserInfo
}

const User = require('../models/user')

const initUsers = [
    {
        username: 'mike',
        name: 'Mikki',
        passwordHash: 'password'
    },
    {
        username: 'johnk',
        name: 'John Kell',
        passwordHash: 'my-password'
    }
]

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {initUsers, usersInDB}
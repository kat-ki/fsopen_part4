const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({});
    response.json(users)
})
usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    const salt = 11
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username, name, passwordHash
    })

    const userSaved = await user.save()

    response.status(201).json(userSaved)
})

module.exports = usersRouter
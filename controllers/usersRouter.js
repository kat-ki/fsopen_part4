const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
    response.json(users)
})
usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    if (!username || !password || username.length < 3 || password.length < 3) {
        return response.status(400).json({error: 'Username or password should be at least 3 characters long'})
    }

    const userExists = await User.findOne({username})
    if (userExists) {
        return response.status(400).json({error: 'Username already exists'});
    }

    const salt = 11
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username, name, passwordHash
    })

    const userSaved = await user.save()

    response.status(201).json(userSaved)
})

module.exports = usersRouter
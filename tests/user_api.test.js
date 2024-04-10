const {test, beforeEach, after, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const {initUsers, usersInDB} = require('./userApi_helper')
const api = supertest(app)

describe('/POST', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        let allUsers = initUsers.map(u => new User(u)).map(u => u.save())
        await Promise.all(allUsers)
    })

    test('should fail to create a new user with invalid credentials', async () => {
        const usersAtStart = await api.get('/api/users')
        const newUser = {
            username: 'lo',
            name: 'Lola Trust',
            passwordHash: 'pswd'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await api.get('/api/users')

        assert(response.body.error.includes("Username or password should be at least 3 characters long"))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    })
})

after(async () => {
    await mongoose.connection.close()
})
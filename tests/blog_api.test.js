const {test, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const initBlogs = require('./blogApi_helper')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})

    let blogElements = initBlogs.map(blog => new Blog(blog))
    const blogElementPromises = blogElements.map(blog => blog.save())

    await Promise.all(blogElementPromises)
})
test('blog posts are returned in JSON format', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('correct amount of blog posts is returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initBlogs.length)
})

test('unique identifier property is named id, not _id', async () => {
    const response = await api.get('/api/blogs')
    const isEveryIdCorrect = response.body.map(el => el.hasOwnProperty('id')).every(id => id === true)

    assert.strictEqual(isEveryIdCorrect, true)
})
after(async () => {
    await mongoose.connection.close()
})
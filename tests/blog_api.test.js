const {test, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const initBlogs = require('./blogApi_helper')
const {response} = require("express");
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

test('new blog is created', async () => {
    const newBlog = {
        title: 'Relax',
        author: 'Anna Bulk',
        url: '',
        likes: 12
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogContent = response.body.map(blog => blog.title)

    assert.strictEqual(response.body.length, initBlogs.length + 1)
    assert(blogContent.includes('Relax'))
})

test('likes property is there, otherwise 0', async () => {
    const newBlog = {
        title: 'Refactoring makes clean',
        author: 'Andy Smith',
        url: ''
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const newBlogAdded = response.body.find(blog => blog.title === newBlog.title)
    assert.strictEqual(newBlogAdded.likes, 0)
})

test.only('title or url properties is missing, backend responds with "400 Bad Request"', async () => {
    const newBlog = {
        author: 'Jack Sparrow',
        url: '',
        likes: 3
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)

    assert.strictEqual(response.statusCode, 400);
})
after(async () => {
    await mongoose.connection.close()
})
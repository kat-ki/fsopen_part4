const {test, beforeEach, after, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const {initBlogs, blogsInDB} = require('./blogApi_helper')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogElements = initBlogs.map(blog => new Blog(blog))
    const blogElementPromises = blogElements.map(blog => blog.save())

    await Promise.all(blogElementPromises)
})
describe('/GET', () => {
    test('blogs should return a list of blog posts in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('blogs should return correct amount of blog posts', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initBlogs.length)
    })
    test('blogs should return a list of blogs with each blog having a unique identifier named id, not _id', async () => {
        const response = await api.get('/api/blogs')
        const isEveryIdCorrect = response.body.map(el => el.hasOwnProperty('id')).every(id => id === true)

        assert.strictEqual(isEveryIdCorrect, true)
    })
})

describe('/POST', () => {
    test('blogs should create a new blog', async () => {
        const newBlog = {
            title: 'Relax', author: 'Anna Bulk', url: 'http', likes: 12
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
    test('blogs should create a new blog and add property named likes if not specified', async () => {
        const newBlog = {
            title: 'Refactoring makes clean', author: 'Andy Smith', url: 'https://'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs');
        const newBlogAdded = response.body.find(blog => blog.title === newBlog.title)
        assert.strictEqual(newBlogAdded.likes, 0)
    })
    test('blogs should respond with an error if title or URL is not specified', async () => {
        const newBlog = {
            author: 'Jack Sparrow', url: '', likes: 3
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)

        assert.strictEqual(response.statusCode, 400);
    })
})
describe('/DELETE', () => {
    test('blogs/:id should delete a single blog', async () => {
        const blogsBeforeDeleting = await blogsInDB()
        const blogToDelete = blogsBeforeDeleting[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAfterDeleting = await blogsInDB()
        const contents = blogsAfterDeleting.map(blog => blog.title)

        assert.strictEqual(blogsAfterDeleting.length, initBlogs.length - 1)
        assert(!contents.includes(blogToDelete.title))
    })
})

describe('/PUT', () => {
    test('blogs/:id should update likes of a blog', async () => {
        const allBlogs = await blogsInDB()
        const blogToUpdate = allBlogs[0]
        const newLikesCount = 22

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send({likes: newLikesCount})
            .expect(200)

        const allBlogsUpdated = await blogsInDB()

        assert.strictEqual(allBlogsUpdated[0].likes, newLikesCount)
    })
})
after(async () => {
    await mongoose.connection.close()
})
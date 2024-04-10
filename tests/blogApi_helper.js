const Blog = require('../models/blog')

const initBlogs = [
    {
        "title": "Better test earlier than later",
        "author": "John Smith",
        "url": "",
        "likes": 5
    },
    {
        "title": "Work smarter not harder",
        "author": "Abra Kadabra",
        "url": "",
        "likes": 8
    },
    {
        "title": "Hard work pays off",
        "author": "Lincoln",
        "url": "",
        "likes": 6
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(note => note.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {initBlogs, blogsInDB, usersInDB}
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blogItem = await Blog.findById(request.params.id)
        if (blogItem) {
            response.json(blogItem)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', middleware.extractUser, async (request, response, next) => {
    const user = request.user
    const blog = new Blog({...request.body, user: user._id})
    try {
        if (!blog.likes) {
            blog.likes = 0
        }
        if (!blog.title || !blog.url) {
            response.status(400).json({error: 'Title or URL is missing'});
        }
        if (!user) {
            return response.status(403).json({error: 'user missing'})
        }

        const newBlog = await blog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        response.status(201).json(newBlog);
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', middleware.extractUser, async (request, response, next) => {
    try {
        const user = request.user
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.status(204).end()
        }
        if (blog.user.toString() !== user._id.toString()) {
            return response.status(403).json({error: 'user not authorized'})
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
        //from solution below
       /* await blog.deleteOne()
        user.blogs = user.blogs.filter(b => b._id.toString() !== blog._id.toString())
        await user.save()
        response.status(204).end()*/
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blogItem = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    try {
        const updatedBlogItem = await Blog.findByIdAndUpdate(request.params.id, blogItem, {new: true}).populate('user', 'name')
        response.json(updatedBlogItem)
        console.log(updatedBlogItem)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('author')
    response.json(blogs)
})
    
blogRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const user = await User.findById(body.author)
    
        const blog = new Blog({
            title: body.title,
            author: user.id,
            url: body.url,
            like: body.likes
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog.id)
        await user.save()

        response.json(savedBlog)

    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).send({error: error.message})
        }
    }
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    try {
        console.log('run update', request.params.id, request.body)
        const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        })
        if(!blog){
            return response.status(404).json({ error: 'Post not found' })
        }
        console.log('responding with status')
        response.status(200).end()
    } catch (error) {
        response.status(400).json({ error: 'Invalid request' })
    }
    
})

module.exports = blogRouter

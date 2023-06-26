const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('bearer ')) {
        return authorization.replace('bearer ', '')
    }
    return null
}

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('author')
    response.json(blogs)
})
    
blogRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
        if (!decodedToken.id) {
            throw new Error('token invalid')
        }

        const user = await User.findById(decodedToken.id)
    
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
        } else if (error.name ===  'JsonWebTokenError') {
            return response.status(400).json({ error: error.message })
        } else if (error.message === 'token invalid') {
            return response.status(401).json({ error: error.message})
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

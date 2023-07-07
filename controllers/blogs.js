const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
    console.log('get request via blogRouter')
    const blogs = await Blog
        .find({})
        .populate('user')
    response.json(blogs)
})
    
blogRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
    console.log('post request via blogRouter')
    
    try {
        const body = request.body
        console.log('post headers', request.headers)

        const user = request.user
        console.log('user', user)
    
        const blog = new Blog({
            title: body.title,
            user: user.id,
            url: body.url,
            like: body.likes,
            author: body.author
        })

        const savedBlog = await blog.save()
        console.log('blog saved')
        user.blogs = user.blogs.concat(savedBlog.id)
        await user.save()

        response.status(201).json(savedBlog)

    } catch (error) {
        // if (error.name === 'ValidationError') {
        //     return response.status(400).send({error: error.message})
        // } else if (error.name ===  'JsonWebTokenError') {

        //     return response.status(400).json({ error: error.message })
        // } else if (error.message === 'token invalid') {
        //     return response.status(401).json({ error: error.message})
        // }
        console.log('error at blogRouter catch block')
        next(error)
    }
})

blogRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    
    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    
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

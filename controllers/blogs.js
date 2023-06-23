const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})
    
blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                return response.status(400).send({error: err.message})
            }
        })
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

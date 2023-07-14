const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    try {
        // console.log('request', request.headers)
        console.log('body', request.body)
        const authorization = request.get('Authorization')
        console.log('authorization', authorization)
        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            request.token = authorization.substring(7)
        } else {
            console.error('no auth header or invalid format')
            return next(new Error('Invalid token'))
        }
        console.log('extracted token', request.token)
        next()
    } catch (error) {
        console.error('Error in tokenExtractor', error)
        next(error)
    }
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return next(new Error('token invalid')) 
    }

    try {
        const user = await User.findById(decodedToken.id)
        request.user = user
        next()
    } catch (error) {
        next(error)
    }    
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
    console.error('error handler', error.message, request.headers)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        console.error('Validation error')
        return response.status(400).send({error: error.message})
    } else if (error.name ===  'JsonWebTokenError') {
        console.error('JWT error')
        return response.status(400).json({ error: error.message })
    } else if (error.message === 'token invalid') {
        return response.status(401).json({ error: error.message})
    } else {
        return response.status(500).send({ error: error.message })
    }
}

module.exports = { tokenExtractor, userExtractor, errorHandler }
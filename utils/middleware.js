const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    console.log('authorization', authorization)
    if (authorization && authorization.startsWith('bearer ')) {
        request.token = authorization.replace('bearer ', '')
    }
    console.log('extracted token', request.token)
    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        throw new Error('token invalid')
    }

    try {
        const user = await User.findById(decodedToken.id)
        request.user = user
        next()
    } catch (error) {
        next(error)
    }    
}

module.exports = { tokenExtractor, userExtractor }
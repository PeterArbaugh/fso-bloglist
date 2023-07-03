const config = require('./utils/config')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

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

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', tokenExtractor, userExtractor, notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
  
module.exports = app
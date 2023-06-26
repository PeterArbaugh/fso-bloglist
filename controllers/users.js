const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs')
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    try {        

        console.log(request.body)
        const { username, name, password } = request.body

        if (password.length < 3) {
            throw new Error('password must have more than 3 characters')
        }

        if (username.length < 3) {
            throw new Error('username must have more than 3 characters')
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash
        })
        const savedUser = await user.save()

        response.status(201).json(savedUser)
        
    } catch (error) {
        console.log('error block')
        if (error.name === 'ValidationError') {
            return response.status(400).send({error: error.message})
        }

        response.status(400).json({
            error: error.message
        })
    }
})


module.exports = usersRouter
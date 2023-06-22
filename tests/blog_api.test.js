const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }  
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

beforeEach(async () => {
    await Blog.deleteMany({})

    await Promise.all(initialBlogs.map( async (blog) => {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }))
})

describe('blogs are saved', () => {
    test('correct number of blogs', async () => {
        const response = await api.get('/api/blogs')
        
        expect(response.body).toHaveLength(initialBlogs.length)
    })
    
    test('id is set', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body[0].id).toBeDefined()
    })
})

describe('saving a new blog with correct fields', () => {
    test('add a new post', async () => {
        const newPost = {
            title: 'New Test Post',
            author: 'Robert G. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewTestPost.html',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .send(newPost)
            .expect(201)
    
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length + 1)
    })
    
    test('set default likes to 0', async () => {
        const newPost = {
            title: 'New Test Post',
            author: 'Robert G. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewTestPost.html'
        }
    
        await api
            .post('/api/blogs')
            .send(newPost)
            .expect(201)
    
        const response = await api.get('/api/blogs')
        expect(response.body[response.body.length - 1].likes).toBe(0)
    })
    
    test('missing title', async () => {
        const badPost ={
            'author': 'test blog 2',
            'url': 'https://google.com'
        }
    
        await api
            .post('/api/blogs')
            .send(badPost)
            .expect(400)
        
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
        
    })
    
    test('missing url', async () => {
        const badPost = {
            'author': 'test blog 2',
            'title': 'bad post with no url'
        }
    
        await api
            .post('/api/blogs')
            .send(badPost)
            .expect(400)
        
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
        
    })
})

describe('delete blogs', () => {
    test('delete a blog and receive 204', async () => {
        const currentBlogs = await blogsInDb()
        const idToDelete = currentBlogs[0].id

        await api
            .delete(`/api/blogs/${idToDelete}`)
            .expect(204)

        const updateBlogs = await blogsInDb()
        expect(updateBlogs).toHaveLength(initialBlogs.length - 1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
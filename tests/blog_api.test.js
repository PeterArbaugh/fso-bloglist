const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

// Define headers for reuse
const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyMSIsImlkIjoiNjQ5YTIwMjBmMGM3ZjUyOTk4NTNmNTA4IiwiaWF0IjoxNjg3ODIyMzc2fQ.nd2K3dV6oTixgMcx6AQS3m-MclPGDY9ApoD8nGp5Wkg'
const headers = {
    'Accept': 'application/json',
    'Authorization': token
}

const initialBlogs = [
    {
        title: 'React patterns',
        author: '649a2020f0c7f5299853f508',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: '649a2020f0c7f5299853f508',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        title: 'Canonical string reduction',
        author: '649a2020f0c7f5299853f508',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        title: 'First class tests',
        author: '649a2020f0c7f5299853f508',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        title: 'TDD harms architecture',
        author: '649a2020f0c7f5299853f508',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        title: 'Type wars',
        author: '649a2020f0c7f5299853f508',
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
}, 10000)

describe('blogs are saved', () => {
    test('correct number of blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .set(headers)
        
        expect(response.body).toHaveLength(initialBlogs.length)
    })
    
    test('id is set', async () => {
        const response = await api
            .get('/api/blogs')
            .set(headers)
    
        expect(response.body[0].id).toBeDefined()
    })
})

describe('saving a new blog with correct fields', () => {
    test('add a new post', async () => {
        const newPost = {
            title: 'New Test Post',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewTestPost.html',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newPost)
            .expect(201)
    
        const response = await api
            .get('/api/blogs')
            .set(headers)
        expect(response.body).toHaveLength(initialBlogs.length + 1)
    })
    
    test('set default likes to 0', async () => {
        const newPost = {
            title: 'New Test Post',
            author: '649a2020f0c7f5299853f508',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/NewTestPost.html'
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newPost)
            .expect(201)
    
        const response = await api
            .get('/api/blogs')
            .set(headers)
        expect(response.body[response.body.length - 1].likes).toBe(0)
    })
    
    test('missing title', async () => {
        const badPost ={
            'author': '649a2020f0c7f5299853f508',
            'url': 'https://google.com'
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(badPost)
            .expect(400)
        
        const response = await api
            .get('/api/blogs')
            .set(headers)
        expect(response.body).toHaveLength(initialBlogs.length)
        
    })
    
    test('missing url', async () => {
        const badPost = {
            'author': '649a2020f0c7f5299853f508',
            'title': 'bad post with no url'
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(badPost)
            .expect(400)
        
        const response = await api
            .get('/api/blogs')
            .set(headers)
        expect(response.body).toHaveLength(initialBlogs.length)
        
    })
})

describe('delete blogs', () => {
    test('delete a blog and receive 204', async () => {
        const currentBlogs = await blogsInDb()
        const idToDelete = currentBlogs[0].id

        await api
            .delete(`/api/blogs/${idToDelete}`)
            .set(headers)
            .expect(204)

        const updateBlogs = await blogsInDb()
        expect(updateBlogs).toHaveLength(initialBlogs.length - 1)
    })
})

test('update a single blog', async () => {
        
    const updatePost = {
        title: 'This post is updated',
        author: '649a2020f0c7f5299853f508',
        url: 'http://blog.cleancoder.com/uncle-bob/updated-post.html'
    }

    console.log(updatePost)

    const currentBlogs = await blogsInDb()
    const idToUpdate = currentBlogs[0].id

    console.log(idToUpdate)

    try {
        await api
            .put(`/api/blogs/${idToUpdate}`)
            .set(headers)
            .send(updatePost)
            .expect(200)
            .catch(error => console.log(error))

        console.log('api complete', idToUpdate)

        const updateBlogs = await blogsInDb()
        const updateBlog = updateBlogs.find(blog => blog.id === idToUpdate)


        console.log('blogs in db', updateBlogs)
        expect(updateBlog.title).toBe(updatePost.title)
        expect(String(updateBlog.author)).toBe(updatePost.author)
        expect(updateBlog.url).toBe(updatePost.url)
    } catch (error) {
        console.error('Error during API call', error)
        throw error
    }
})


afterAll(async () => {
    await mongoose.connection.close()
})
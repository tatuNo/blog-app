const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../../app')

const User = require('../../server/models/user')
const Blog = require('../../server/models/blog')
const api = supertest(app)

jest.useRealTimers()

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
})

describe('when there is intially blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('id defined correctly', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a blog', () => {
  test('a valid blog can be added when logged in', async () => {
    const user = {
      username: 'AdaLo',
      name: 'Ada Lovelace',
      password: 'adanpassu'
    }

    await api
      .post('/api/users')
      .send(user)

    const loginResponse =
    await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'Google',
      author: 'Erkki Esimerkki',
      url: 'www.google.com',
      likes: '6'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContainEqual('Google')
  })
  test('cannot add blog without token', async () => {

    const newBlog = {
      title: 'Google',
      author: 'Erkki Esimerkki',
      url: 'www.google.com',
      likes: '6'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
    expect(titles).not.toContainEqual('Google')
  })

  test('when likes not defined, likes = 0', async () => {
    const user = {
      username: 'AdaLo',
      name: 'Ada Lovelace',
      password: 'adanpassu'
    }

    await api
      .post('/api/users')
      .send(user)

    const loginResponse =
    await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'Google',
      author: 'Erkki Esimerkki',
      url: 'www.google.com',
    }

    const result =
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(result.body.likes).toBe(0)
  })

  test('blog without url cannot be added', async () => {
    const user = {
      username: 'AdaLo',
      name: 'Ada Lovelace',
      password: 'adanpassu'
    }

    await api
      .post('/api/users')
      .send(user)

    const loginResponse =
    await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'Google',
      author: 'Erkki Esimerkki',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without title cannot be added', async () => {
    const user = {
      username: 'AdaLo',
      name: 'Ada Lovelace',
      password: 'adanpassu'
    }

    await api
      .post('/api/users')
      .send(user)

    const loginResponse =
    await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      author: 'Erkki Esimerkki',
      url: 'www.google.com',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting a blog', () => {
  test('user can delete own blog', async () => {
    const user = {
      username: 'AdaLo',
      name: 'Ada Lovelace',
      password: 'adanpassu'
    }

    await api
      .post('/api/users')
      .send(user)

    const loginResponse =
    await api
      .post('/api/login')
      .send(user)


    const newBlog = {
      title: 'Google',
      author: 'Erkki Esimerkki',
      url: 'www.google.com',
      likes: '6'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)

    const blogToDelete = await Blog.findOne({ title: 'Google' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.titles)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

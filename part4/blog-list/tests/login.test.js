const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when users are in the database', () => {

  const firstUser = {
    username: 'root',
    name: 'Amon',
    password: 'test'
  }

  const secondUser = {
    username: 'bad',
    name: 'Honda',
    password: 'test'
  }

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send(firstUser)

    await api
      .post('/api/users')
      .send(secondUser)
  })


  test('logging in with invalid credentials returns with appropriate error', async () => {
    const loginDetails = {
      username: firstUser.username,
      password: 'blah'
    }

    const result = await api.post('/api/login')
      .send(loginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

  test('logging in returns token, username, and name', async () => {
    const loginDetails = {
      username: firstUser.username,
      password: firstUser.password
    }

    const result = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert('token' in result.body)
    assert.strictEqual(result.body.username, firstUser.username)
    assert.strictEqual(result.body.name, firstUser.name)
  })

  test('posting blog with invalid token returns with appropriate error', async () => {
    const firstPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }
    const token = 'gaga'

    const result = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(firstPost)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('token invalid'))
  })

  test('successfully posts blog after logging in', async () => {
    const loginDetails = {
      username: firstUser.username,
      password: firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }

    const token = loginResult.body.token

    const postBlogResult = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(firstPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(postBlogResult.body.title, firstPost.title)
    assert.strictEqual(postBlogResult.body.user.username, firstUser.username)
  })

  test('deleting a blog with wrong user token returns appropriate error', async() => {
    const loginDetails = {
      username: firstUser.username,
      password: firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }

    const token = loginResult.body.token

    const postBlogResult = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(firstPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const loginDetails2 = {
      username: secondUser.username,
      password: secondUser.password
    }

    const loginResult2 = await api.post('/api/login')
      .send(loginDetails2)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token2 = loginResult2.body.token

    const deleteResult = await api.delete(`/api/blogs/${postBlogResult.body.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(401)

    assert(deleteResult.body.error.includes('UserID mismatch'))
  })

  test('deleting a blog with valid credentials is succesful', async() => {
    const loginDetails = {
      username: firstUser.username,
      password: firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }

    const token = loginResult.body.token

    const postBlogResult = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(firstPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api.delete(`/api/blogs/${postBlogResult.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const user = await User.findOne({ username: firstUser.username })

    assert.strictEqual(user.blogs.length, 0)
    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
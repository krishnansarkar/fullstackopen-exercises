const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are blogs in the db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initalBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('GET /api/blogs returns correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body
    assert.strictEqual(contents.length, helper.initalBlogs.length)
  })

  test('the unique identifier of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const firstContent = response.body[0]
    assert('id' in firstContent)
  })
})

describe('when there are users in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userPromiseArray = helper.initialUsers.map(async (user) => {
      await api.post('/api/users')
        .send(user)
    })
    await Promise.all(userPromiseArray)

    await Blog.deleteMany({})
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

  test('posting blog with no token returns with appropriate error', async () => {
    const firstPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }

    const result = await api.post('/api/blogs')
      .send(firstPost)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('token invalid'))
  })

  test('posting a blog with valid token is successful', async () => {
    const loginDetails = {
      username: helper.firstUser.username,
      password: helper.firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }

    const token = loginResult.body.token

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const content = response.body

    assert.strictEqual(content.length, 1)
    assert(content.find(post =>
      post.title === newPost.title
      && post.author === newPost.author
      && post.url === newPost.url
      && post.likes === newPost.likes
      && post.user.username === helper.firstUser.username))
  })

  test('posting a blog with valid token but missing likes defaults likes to 0', async () => {
    const loginDetails = {
      username: helper.firstUser.username,
      password: helper.firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      url: 'www.a.com'
    }

    const token = loginResult.body.token

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const content = response.body

    assert.strictEqual(content.length, 1)
    assert(content.find(post =>
      post.title === newPost.title
      && post.author === newPost.author
      && post.url === newPost.url
      && post.likes === 0
      && post.user.username === helper.firstUser.username))
  })

  test('posting a blog with valid token, but missing title responds with status code 400', async () => {
    const loginDetails = {
      username: helper.firstUser.username,
      password: helper.firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newPost = {
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
    }

    const token = loginResult.body.token

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect(400)
  })

  test('posting a blog with valid token, but missing url responds with status code 400', async () => {
    const loginDetails = {
      username: helper.firstUser.username,
      password: helper.firstUser.password
    }

    const loginResult = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newPost = {
      title: 'Is Guru the best?',
      author: 'Benji',
      likes: 100,
    }

    const token = loginResult.body.token

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect(400)
  })

  describe('when there is one blog', () => {
    beforeEach(async () => {
      Blog.deleteMany({})

      const loginDetails = {
        username: helper.firstUser.username,
        password: helper.firstUser.password
      }

      const loginResult = await api.post('/api/login')
        .send(loginDetails)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newPost = {
        title: 'Is Guru the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 100,
      }

      const token = loginResult.body.token

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })

    describe('deletion of a blog', () => {
      test('succeeds with status code 204 if valid', async () => {
        const blogs = await helper.blogsInDb()
        const id = blogs[0].id

        const loginDetails = {
          username: helper.firstUser.username,
          password: helper.firstUser.password
        }

        const loginResult = await api.post('/api/login')
          .send(loginDetails)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const token = loginResult.body.token

        await api.delete(`/api/blogs/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 0)
      })

      test('returns with status code 500 if invalid', async () => {
        const id = -1

        const loginDetails = {
          username: helper.firstUser.username,
          password: helper.firstUser.password
        }

        const loginResult = await api.post('/api/login')
          .send(loginDetails)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const token = loginResult.body.token

        await api.delete(`/api/blogs/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(500)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 1)
      })
    })

    describe('updating a blog', () => {
      test('succeeds with status code 200 if valid', async () => {
        const loginDetails = {
          username: helper.firstUser.username,
          password: helper.firstUser.password
        }

        const loginResult = await api.post('/api/login')
          .send(loginDetails)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const token = loginResult.body.token

        const blogs = await helper.blogsInDb()
        const firstBlog = blogs[0]
        const newLikes = 69
        await api
          .put(`/api/blogs/${firstBlog.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ likes: newLikes })
          .expect(200)

        const updatedBlogs = await helper.blogsInDb()
        assert(updatedBlogs.find(blog =>
          blog.title === blog.title
          && blog.author === blog.author
          && blog.url === blog.url
          && blog.likes === newLikes
        ))
      })

      test('fails with status code 500 if invalid id', async () => {
        const loginDetails = {
          username: helper.firstUser.username,
          password: helper.firstUser.password
        }

        const loginResult = await api.post('/api/login')
          .send(loginDetails)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const token = loginResult.body.token

        const newLikes = 69
        await api
          .put(`/api/blogs/${-99}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ likes: newLikes })
          .expect(500)
      })

      test('fails with status code 400 if invalid body', async () => {
        const loginDetails = {
          username: helper.firstUser.username,
          password: helper.firstUser.password
        }

        const loginResult = await api.post('/api/login')
          .send(loginDetails)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const token = loginResult.body.token

        await api
          .put(`/api/blogs/${-99}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ dog: 'food' })
          .expect(400)
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})


const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when one user and blog is in the database', () => {

  const firstUser = {
    username: 'root',
    name: 'Amon',
    password: 'test'
  }

  const firstPost = {
    title: 'Is Guru the best?',
    author: 'Benji',
    url: 'www.a.com',
    likes: 100,
  }

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send(firstUser)

    await api
      .post('/api/blogs')
      .send(firstPost)
  })


  test('retrieving a blog returns it\'s creator\'s user information', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    assert('user' in firstBlog)
    const user = firstBlog.user
    assert.strictEqual(user.username, firstUser.username)
    assert.strictEqual(user.name, firstUser.name)
  })

  test('retrieving a user returns their blogs', async () => {
    const response = await api.get('/api/users')
    const firstUser = response.body[0]
    assert('blogs' in firstUser)

    assert(firstUser.blogs.find(blog =>
      blog.title === firstPost.title &&
      blog.author === firstPost.author &&
      blog.url === firstPost.url &&
      blog.likes === firstPost.likes))
  })
})

after(async () => {
  await mongoose.connection.close()
})
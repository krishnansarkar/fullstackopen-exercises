const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initalBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('blog api', () => {
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

  test('POST /api/blogs successfully creates a new blog post', async () => {
    const newPost = {
      'title': 'Is Gagoonga the best?',
      'author': 'Gagoonga',
      'url': 'http://google.com',
      'likes': 10000
    }

    await api
      .post('/api/blogs')
      .send(newPost)

    const response = await api.get('/api/blogs')
    const content = response.body

    assert.strictEqual(content.length, helper.initalBlogs.length + 1)
    assert(content.find(post =>
      post.title === newPost.title
      && post.author === newPost.author
      && post.url === newPost.url
      && post.likes === newPost.likes))
  })

  test('If POST /api/blogs is missing likes, default to 0', async () => {
    const newPost = {
      'title': 'Is Gagoonga the best?',
      'author': 'Gagoonga',
      'url': 'http://google.com',
    }

    await api
      .post('/api/blogs')
      .send(newPost)

    const response = await api.get('/api/blogs')
    const content = response.body

    assert.strictEqual(content.length, helper.initalBlogs.length + 1)
    assert(content.find(post =>
      post.title === newPost.title
      && post.author === newPost.author
      && post.url === newPost.url
      && post.likes === 0))
  })

  test('If POST /api/blogs is missing title, respond with status code 400', async () => {
    const newPost = {
      'author': 'Gagoonga',
      'url': 'http://google.com',
    }

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(400)
  })

  test('If POST /api/blogs is missing url, respond with status code 400', async () => {
    const newPost = {
      'title': 'Is Gagoonga the best?',
      'author': 'Gagoonga'
    }

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
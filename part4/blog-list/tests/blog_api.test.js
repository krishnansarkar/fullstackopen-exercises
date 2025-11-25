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
})

after(async () => {
  await mongoose.connection.close()
})
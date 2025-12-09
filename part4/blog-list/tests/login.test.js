const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when one user is in the database', () => {

  const firstUser = {
    username: 'root',
    name: 'Amon',
    password: 'test'
  }

  beforeEach(async () => {
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send(firstUser)
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
})

after(async () => {
  await mongoose.connection.close()
})
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initally one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'yahoo',
      name: 'Yahoo Smith',
      password: 'nicejob'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    assert(usersAtEnd.find(u => u.username === newUser.username))
  })

  test('getting users returns the current number of users', async () => {
    const response = await api.get('/api/users')
    const content = response.body
    assert.strictEqual(content.length, 1)
  })

  test('creating a user with an invalid username responds with status code 400 and an appropriate error message', async () => {
    const newUser = {
      username: 'y',
      name: 'Yahoo Smith',
      password: 'nicejob'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('username: must be at least 3 characters long'))
  })

  test('creating a user with an invalid password responds with status code 400 and an appropriate error message', async () => {
    const newUser = {
      username: 'yahoo',
      name: 'Yahoo Smith',
      password: 'ni'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('password: must be at least 3 characters long'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
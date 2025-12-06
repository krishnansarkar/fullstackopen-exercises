const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
<<<<<<< HEAD
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
=======
const blogsRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
>>>>>>> 5266179eec6d3d33308633fbc9f1d084351b2307

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
<<<<<<< HEAD
app.use(middleware.errorHandler)
=======
>>>>>>> 5266179eec6d3d33308633fbc9f1d084351b2307

module.exports = app
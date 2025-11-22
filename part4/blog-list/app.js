const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blog')

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
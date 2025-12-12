const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const newBlog = request.body
  if(!newBlog.title || !newBlog.url)
    return response.status(400).end()

  if(!newBlog.likes)
    newBlog.likes = 0

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if(!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  newBlog.user = user._id

  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const returnedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(returnedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if(blog.user.toString() !== decodedToken.id.toString())
    return response.status(401).json({ error: 'UserID mismatch' })

  const user = await User.findById(decodedToken.id)
  if(!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  user.blogs = user.blogs.filter(b => b._id.toString() !== blog._id.toString())
  await user.save()

  await blog.deleteOne()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  if(!request.body.likes){
    return response.status(400).end()
  }

  const blog = await Blog.findById(request.params.id)
  blog.likes = request.body.likes
  await blog.save()
  response.status(200).json(blog)
})

module.exports = blogsRouter
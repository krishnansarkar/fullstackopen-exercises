const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const newBlog = request.body
  if(!newBlog.title || !newBlog.url)
    return response.status(400).end()

  if(!newBlog.likes)
    newBlog.likes = 0

  const user = request.user

  newBlog.user = user._id

  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const returnedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(returnedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  let blog
  try {
    blog = await Blog.findById(request.params.id)
  } catch {
    return response.status(500).json({ error: 'invalid id' })
  }

  if(blog.user.toString() !== user._id.toString())
    return response.status(401).json({ error: 'UserID mismatch' })

  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())
  await user.save()

  await blog.deleteOne()

  response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  if(!request.body.likes){
    return response.status(400).end()
  }

  const user = request.user
  let blog
  try {
    blog = await Blog.findById(request.params.id)
  } catch {
    return response.status(500).json({ error: 'invalid id' })
  }

  if(blog.user.toString() !== user._id.toString())
    return response.status(401).json({ error: 'UserID mismatch' })

  blog.likes = request.body.likes
  await blog.save()
  response.status(200).json(blog)
})

module.exports = blogsRouter
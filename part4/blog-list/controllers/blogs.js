const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const newBlog = request.body
  if(!newBlog.title || !newBlog.url)
    return response.status(400).end()

  if(!newBlog.likes)
    newBlog.likes = 0
  const blog = new Blog(newBlog)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
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
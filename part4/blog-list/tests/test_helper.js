const Blog = require('../models/blog')

const initalBlogs = [
  {
    title: 'Is Benji the best?',
    author: 'Benji',
    url: 'www.a.com',
    likes: 100,
  },{
    title: 'Is Nunji the best?',
    author: 'Nunji',
    url: 'www.b.com',
    likes: 10,
  },{
    title: 'Is Wamoji the best?',
    author: 'Nunji',
    url: 'www.c.com',
    likes: 1,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initalBlogs,
  blogsInDb
}
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  // const counts = lodash.countBy(blogs, 'author')
  // const entries = lodash.entries(counts)
  // const max = lodash.maxBy(entries, ([author, count]) => count)

  const max = _.chain(blogs)
    .countBy('author')
    .entries()
    .maxBy(([author, count]) => count)
    .value()
  return {
    author: max[0],
    blogs: max[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  return _.chain(blogs)
    .groupBy('author')
    .map((posts, author) => ({
      author: author,
      likes: _.sumBy(posts, 'likes'),
    }))
    .maxBy('likes')
    .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
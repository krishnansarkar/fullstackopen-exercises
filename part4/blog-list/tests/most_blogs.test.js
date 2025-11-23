const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  test('of empty list is null', () => {
    const blogs = []

    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals that author', () => {
    const blogs = [
      {
        _id: '1232130912049',
        title: 'Is Benji the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 100,
        __v: '0'
      }]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Benji',
      blogs: 1
    })
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      {
        _id: '1232130912049',
        title: 'Is Benji the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 100,
        __v: '0'
      },{
        _id: '32423dsfsd',
        title: 'Is Nunji the best?',
        author: 'Nunji',
        url: 'www.b.com',
        likes: 10,
        __v: '0'
      },{
        _id: '1232130912049',
        title: 'Is Wamoji the best?',
        author: 'Nunji',
        url: 'www.c.com',
        likes: 1,
        __v: '0'
      }]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Nunji',
      blogs: 2
    })
  })
})

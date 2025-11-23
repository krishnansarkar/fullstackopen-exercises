const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, null)
  })

  test('when list has only one blog equals that', () => {
    const blogs = [
      {
        _id: '1232130912049',
        title: 'Is Benji the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 100,
        __v: '0'
      }]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: '1232130912049',
      title: 'Is Benji the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
      __v: '0'
    })
  })

  test('of a bigger list is computed right', () => {
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
        author: 'Wamoji',
        url: 'www.c.com',
        likes: 1,
        __v: '0'
      }]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: '1232130912049',
      title: 'Is Benji the best?',
      author: 'Benji',
      url: 'www.a.com',
      likes: 100,
      __v: '0'
    })
  })
})

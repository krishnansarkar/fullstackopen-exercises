const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  test('of empty list is null', () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals that author and like count', () => {
    const blogs = [
      {
        _id: '1232130912049',
        title: 'Is Benji the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 0,
        __v: '0'
      }]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Benji',
      likes: 0
    })
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      {
        _id: '1232130912049',
        title: 'Is Benji the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 0,
        __v: '0'
      },{
        _id: '32423dsfsd',
        title: 'Is Nunji the best?',
        author: 'Wamoji',
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

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Wamoji',
      likes: 11
    })
  })
})

const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [
      {
        _id: '1232130912049',
        title: 'Is Benji the best?',
        author: 'Benji',
        url: 'www.a.com',
        likes: 100,
        __v: '0'
      }]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 100)
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
        author: 'Wamoji',
        url: 'www.c.com',
        likes: 1,
        __v: '0'
      }]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 111)
  })
})

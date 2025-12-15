const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')
  next()
}

const userExtractor = async (request, response, next) => {

  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if(!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  request.user = user

  next()
}

const errorHandler = (error, request, response, next) => {
  //console.log(error.name, error.message)

  if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })
  if (error.name === 'JsonWebTokenError')
    return response.status(401).json({ error: 'token invalid' })

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}
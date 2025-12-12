const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')
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
  errorHandler
}
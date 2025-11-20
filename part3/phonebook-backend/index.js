require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')
const port = process.env.PORT

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
)

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((count) => {
    return response(
      `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
    )
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    return response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        const error = new Error('invalid id')
        error.name = '404Error'
        return next(error)
      }
      return response.json(person)
    })
    .catch((error) => {
      console.log('error fetching from MongoDB', error.message)
      return next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!person.name) {
    const error = new Error('name missing')
    error.name = '400Error'
    return next(error)
  }
  if (!person.number) {
    const error = new Error('number missing')
    error.name = '400Error'
    return next(error)
  }
  // if (persons.find((p) => p.name.toLowerCase() == person.name.toLowerCase()))
  //     return response.status(400).json({
  //         error: "name must be unique",
  //     });

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  })
  newPerson
    .save()
    .then((result) => {
      return response.json(result)
    })
    .catch((error) => {
      console.log('error posting to MongoDB: ', error.message)
      return next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  if (!name) {
    const error = new Error('name missing')
    error.name = '400Error'
    return next(error)
  }
  if (!number) {
    const error = new Error('number missing')
    error.name = '400Error'
    return next(error)
  }

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        const error = new Error('invalid id')
        error.name = '404Error'
        return next(error)
      }

      person.name = name
      person.number = number

      person
        .save({ runValidators: true })
        .then(() => {
          return response.json(person)
        })
        .catch((error) => next(error))
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => {
      console.log('error deleting from MongoDB: ', error.message)
      return next(error)
    })
})

const errorHandler = (error, request, response, next) => {
  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'malformatted id' })
    case 'SyntaxError':
      return response.status(400).send({ error: 'malformatted body' })
    case 'ValidationError':
      return response.status(400).send({ error: error.message })
    case '400Error':
      return response.status(400).send({ error: error.message })
    case '404Error':
      return response.status(404).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

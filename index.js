require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/persons')

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
  
const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError' && error.errors['name']) {
    return response.status(400).send(error.errors.name.properties.message)
  }
  else if (error.name === 'ValidationError' && error.errors['number']) {
    return response.status(400).send(error.errors.number.properties.message)
  }
  next(error)
}

/* let numbers = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
] */

app.get('/info', (req, res) => {
  Person.find({})
    .then(result => {
      console.log(result)
      res.send(`<div><p>Phonebook has info for ${result.length} people</p><p>${new Date}</p></div>`)
    })
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      console.log(result)
      res.json(result)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findOne({_id: id})
    .then(result => {
      if (result !== null) {
        res.json(result)
      }
      else {
        next()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  let person = req.body

  if (!person.name || !person.number || person.name === '' || person.number === '') {
    console.log('test')
    res.status(500).send({ error:'please add name and number' })
  }
  else {
    Person.create(person)
      .then(result => {
        res.json(result)
      })
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson !== null) {
        res.json(updatedPerson)
      }
      else {
        next()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result !== null) {
        res.status(204).end()
      }
      else {
        next()
      }
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT)
console.log(`Server running on ${PORT}`)
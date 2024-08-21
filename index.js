// added dotenv
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// importing person module
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
// added morgan to log stuff
app.use(morgan('tiny'))

// variables for length of persons and current date
  const currentDate = new Date().toString()
// info page
  const info = () => {
    return (
      `<p>Phonebook has info for ${personsLenght} people</p> 
      <p>${currentDate}</p>`
    )
  }
  // get homepage
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  // modified to fetch data from mongoDB
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })
// info added to show to phonebooks contact amount and date
  app.get('/info', (request, response) => {
    response.send(info())
  })
// get person id, modified to get data from database
  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  // delete person, modified to delete from database.
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  // post person, modified to post to mongoDB
  app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
      response.status(200).end()
    })
    .catch(error => next(error))
  })

 // unkown endpoint handler
  const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
  }

  app.use(unkownEndpoint)
// error handler
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
      return response.status(400).send( {error:"malformatted id"} )
    }
    // added an if for validation errors to show a more compact error message
    else if (error.name === "ValidationError") {
      return response.status(400).json({
        error: "validation error",
        message: error.message
      })
    }
    next(error)
  }

  app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

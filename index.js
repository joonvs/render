const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())
// added morgan to log stuff
app.use(morgan('tiny'))

let persons = [
    {
      id: "1",
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: "2",
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: "3",
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: "4",
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
  ]
// variables for length of persons and current date
  const personsLenght = persons.length
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
  // get persons directory
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
// info added to show to phonebooks contact amount and date
  app.get('/info', (request, response) => {
    response.send(info())
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })
  // delete person
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
// generate id using math.random()
  const generateId = () => {
    const personIds = persons.map(person => person.id)
    const min = "1000"
    const max = "10000"
    let newId = Math.floor(Math.random() * (max - min) + min).toString()
    if (!personIds.includes(newId)) {
      return(newId)
    }
    // pretty bad error handling, a while loop would have been better i guess. now if the id happens to be the same it just throws error
    return response.status(400).json({ 
      error: 'id is in use' 
    })
  }
  // post person
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)   
    // added if statement to check if number or name is missing
    if (!body.name || !body.number) {
      return response.status(406).json({ 
        error: 'name or number missing' 
      })
    }
// added if to check if name is already in the persons variable
  const names = persons.map(person => person.name)
    console.log(names)
    if (names.includes(body.name)) {
      return response.status(403).json({
        error: 'name must be unique'
      })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



const express = require('express')
const { response, request } = require('express')
const morgan = require('morgan')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
// app.use(requestLogger)
app.use(morgan('combined'))


persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.header('Content-Type', 'text/html')
    const today = new Date()
    response.send(`<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${today}</p>
    </div>`)
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/person/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((n) => n.id === id)
    return person ? response.send(person) : response.status(404).end()
})

app.delete('/api/person/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((n) => n.id !== id)
    response.status(204).end()
})

const getMaxId = () => {
    if (persons.length === 0) return 0
    const maxId = Math.max(...persons.map((person) => person.id))
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number ) {
        return response.status(400).json({
            error: 'invalid data format'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getMaxId(),
    }

    persons = persons.concat(person)
    response.json(person)
})


app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)


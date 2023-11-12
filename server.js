const express = require('express')
const { response, request } = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const app = express()
const Note = require('./models/note')
const Person = require('./models/person')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.name)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))
require('dotenv').config()

app.get('/', (request, response) => {
    response.send('hello world')
})

app.get('/api/notes', (request, response) => {
    // response.send(notes)
    Note.find({}).then((notes) => {
        // console.log(notes)
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body
    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' }
    )
        .then((note) => {
            response.json(note)
        })
        .catch((e) => next(e))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end()
        })
        .catch((error) => next(error))
    s
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        // id: getMaxId(),
    })

    // notes = notes.concat(note);
    // console.log(notes);
    note.save()
        .then((savedNote) => {
            response.json(note)
        })
        .catch((e) => next(e))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        return response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) response.json(person)
            else response.status(404).end()
        })
        .catch((e) => next(e))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing',
        })
    }

    Person.find({ name: body.name }).then((exist) => {
        if (exist && exist.length) {
            console.log(exist)
            Person.findByIdAndUpdate(
                exist[0].id,
                { name: body.name, number: body.number },
                { new: true, runValidators: true, context: 'query' }
            )
                .then((updated) => {
                    // console.log(updated)
                    response.json(updated)
                })
                .catch((e) => next(e))
        } else {
            const person = new Person({
                name: body.name,
                number: body.number,
            })
            person.save().then((person) => {
                response.json(person)
            })
              .catch(e => next(e))
        }
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then((note) => {
            response.json(note)
        })
        .catch((e) => next(e))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

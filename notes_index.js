const express = require('express')
const { response, request } = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('combined'))
require("dotenv").config();

let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        important: true,
    },
    {
        id: 2,
        content: 'Browser can execute only JavaScript',
        important: false,
    },
    {

        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        important: true,
    },
]

app.get('/', (request, response) => {
    response.send('hello world')
})

app.get('/api/notes', (request, response) => {
    response.send(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find((n) => n.id === id)
    return note ? response.send(note) : response.status(404).end()
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id == id)

    if(!note)
        return response.status(404).end()

    const modifiedNote = {
        ...note,
        important: !note.important
    }
    notes = notes.map(note => note.id !== id ? note : modifiedNote)
    return response.send(note)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter((note) => note.id !== id)
    console.log(notes[0].id === id)
    console.log(notes)
    response.status(204).end()
})

const getMaxId = () => {
    if (notes.length === 0) return 0
    const maxId = Math.max(...notes.map((note) => note.id))
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content) {
        return response.status(400).json({
            error: 'content is missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: getMaxId(),
    }

    notes = notes.concat(note)
    console.log(notes)
    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
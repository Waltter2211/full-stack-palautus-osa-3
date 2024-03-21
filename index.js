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

let numbers = [
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
]

app.get("/info", (req, res) => {
    res.send(`<div><p>Phonebook has info for ${numbers.length} people</p><p>${new Date}</p></div>`)
})

app.get("/api/persons", (req, res) => {
    Person.find({})
    .then(result => {
        console.log(result)
        res.json(result)
    })
    .catch(err => {
        console.log(err)
    })
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findOne({_id: id})
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({ error:"person not found" })
    })
})

app.post("/api/persons", (req, res) => {
    let person = req.body

    if (!person.name || !person.number || person.name === "" || person.number === "") {
        res.status(404).json({ error:"please add name and number" })
    }
    else {
        const personBody = new Person(person)
        personBody.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
            res.send(err.message)
        })
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    numbers = numbers.filter((number) => number.id !== id)
    res.json(numbers)
})

app.listen(PORT)
console.log(`Server running on ${PORT}`)
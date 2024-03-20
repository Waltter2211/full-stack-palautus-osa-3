const express = require('express')
const PORT = 3001

const app = express()

const numbers = [
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
    res.json(numbers)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = numbers.find((number) => number.id === id)

    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const filtered = numbers.filter((number) => number.id !== id)
    if (filtered.length === numbers.length) {
        res.status(404).json({message:"person not found"})
    }
    else {
        res.json(filtered)
    }
})

app.listen(PORT)
console.log(`Server running on ${PORT}`)
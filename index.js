const express = require('express')
const PORT = 3001

const app = express()

app.use(express.json())

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

app.post("/api/persons", (req, res) => {
    let person = req.body
    person.id = Math.floor(Math.random()*100)

    if (!person.name || !person.number || person.name === "" || person.number === "") {
        res.status(404).json({ error:"please add name and number" })
    }
    else {
        const foundName = numbers.find((number) => number.name === person.name)
        if (foundName) {
            res.status(403).json({ error:"name must be unique" })
        }
        else {
            numbers = numbers.concat(person)
            res.json(person)
        }
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    numbers = numbers.filter((number) => number.id !== id)
    res.json(numbers)
})

app.listen(PORT)
console.log(`Server running on ${PORT}`)
const mongoose = require('mongoose')
const password = process.argv[2]

const url = `MONGO`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name:String,
  number:String,
})

const Persons = mongoose.model('Persons', personsSchema)

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}
else if (process.argv.length === 3) {
    Persons.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length === 5) {
    const person = new Persons({
        name:process.argv[3],
        number:process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
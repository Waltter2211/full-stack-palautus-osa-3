require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
.then(success => {
    console.log("connected to database")
})
.catch(err => {
    console.log("connection failed", err.message)
})

const personsSchema = new mongoose.Schema({
    name:String,
    number:String
})

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Persons', personsSchema)
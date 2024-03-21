require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(success => {
    console.log('connected to database')
  })
  .catch(err => {
    console.log('connection failed', err.message)
  })

const personsSchema = new mongoose.Schema({
  name:{
    type:String,
    minLength:3
  },
  number:{
    type:String,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d{7,8}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    minLength:[8, 'length must be minimum of 8']
  }
})

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Persons', personsSchema)
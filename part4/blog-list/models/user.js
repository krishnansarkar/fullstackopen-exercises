const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
<<<<<<< HEAD
    unique: true,
    minLength: [3, 'must be at least 3 characters long']
=======
    unique: true
>>>>>>> 5266179eec6d3d33308633fbc9f1d084351b2307
  },
  name: String,
  passwordHash: String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)
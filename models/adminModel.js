const { model, Schema } = require('mongoose')

const adminSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
}, {
   timestamps: true
})

module.exports = model('Admin', adminSchema)
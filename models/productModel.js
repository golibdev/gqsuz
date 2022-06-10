const { model, Schema } = require('mongoose')

const productSchema = new Schema({
   code: {
      type: String,
      required: true,
      unique: true
   },
   ruContent: {
      type: String,
      required: true
   },
   uzContent: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   }
}, {
   timestamps: true
})

module.exports = model('Product', productSchema)
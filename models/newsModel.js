const { model, Schema } = require('mongoose')

const newsSchema = new Schema({
   uzTitle: {
      type: String,
      required: true
   },
   ruTitle: {
      type: String,
      required: true
   },
   uzSlugUrl: {
      type: String,
      required: true
   },
   ruSlugUrl: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   uzContent: {
      type: String,
      required: true
   },
   ruContent: {
      type: String,
      required: true
   },
   views: {
      type: Number,
      default: 0
   }
}, {
   timestamps: true
})

module.exports = model('News', newsSchema)
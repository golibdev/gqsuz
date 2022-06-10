const mongoose = require('mongoose')
const seed = require('../seed/createAdmin')

const connectDB = async () => {
   try {
      const conn = await mongoose.connect(process.env.MONGO_URI)
      console.log(`MongoDB connected: ${conn.connection.host}`)
      await seed.createAdmin()
   } catch (err) {
      console.log(err)
   }
}

module.exports = {
   connectDB
}
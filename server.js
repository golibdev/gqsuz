const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const flash = require('express-flash')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const dotenv = require('dotenv')
const { connectDB } = require('./config/db')
const homeRoutes = require('./routes/homeRoutes')
const adminRoutes = require('./routes/adminRoute')
const helpers = require('./utils/hbsHelpers')
const app = express()

// env variable initilize
dotenv.config()

// Create session store
const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

// use json middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// register handlebars helpers
helpers(Handlebars)

app.use(session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: true,
    saveUninitialized: true
}))

app.use(flash())
app.use(fileUpload())

// Create static public folder
app.use(express.static(path.join(__dirname, 'public')))

// Set hbs shablonizator
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use('/', homeRoutes)
app.use('/auth', adminRoutes)

connectDB()

port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port: ${port}`))
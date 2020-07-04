const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')// for handling template engines
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


///load config variabless from config.env
dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)
connectDB()

const app = express()

///body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const {stripTags,truncate} = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({ 
    
    helpers:{
        stripTags,
        truncate,
    }
    ,
    defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs')


///sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:new MongoStore({mongooseConnection:mongoose.connection})

}))



///pasport middleware
app.use(passport.initialize())
app.use(passport.session())




//// static folder
app.use(express.static(path.join(__dirname, 'public')))


///Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV}`));
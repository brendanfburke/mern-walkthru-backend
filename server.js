require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()

// object destructuring, grabbing all values from .env and defining them in one place
const { PORT = 3000, MONGODB_URI } = process.env

// this should be in a config folder, in a db.connection.js file
mongoose.connect(MONGODB_URI)

mongoose.connection.on('open', () => {
    console.log('you are connected')
})
mongoose.connection.on('close', () => {
    console.log('you are disconnected')
})    
mongoose.connection.on('error', () => {
    console.log('error')
})    


// middleware 
const cors = require('cors')
const morgan = require('morgan')

// models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model('People', PeopleSchema)

// more middleware stuff

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


// basic express routing test
app.get('/', (req, res) => {
    res.send('root page brother')
})

app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/people', async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get('/people/:id', async (req, res) => {
    try {
        res.json(await People.findById(req.params.id) )
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndDelete(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
//Dependencies
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const {PORT, DATABASE_URL} = process.env

//Middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded())

//Mongoose
mongoose.connect(DATABASE_URL)
mongoose.connection
.on('connected', () => console.log('MongoDB is connected'))
.on('error', (err) => console.log('Not connected to MongoDB: ' + err))
.on('disconnected', () => console.log("MongoDB is disconnected"))

//Schema
const problemSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    detail: String,
    solution: String,
    solutionimage: String,
    recurl: String,
    recimage: String
})

const Problem = mongoose.model('Problem', problemSchema)

//Routes

app.get('/', (req, res) => {
    console.log("Oh hey! I got a request. Let me respond with something")
    res.send('Hello World')
})

//Index
app.get('/problems', async (req, res) => {
    try {
        res.json(await Problem.find({}))
    } catch (err){
        console.log('error', err)
        res.send({error: 'Something has gone horribly wrong...'})
    }
})

app.post("/problems", (req, res) => {
    try {
        // send all people
        Problem.create(req.body, (error, createdProblem) => {
            res.send(createdProblem);
        });
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//Listener

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`)
})
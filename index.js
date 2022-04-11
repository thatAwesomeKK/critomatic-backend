const express = require('express')
const app = express()
const connectToMongo = require('./db')
connectToMongo()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

app.get('/', (req, res)=>{
    res.send("Hello World")
})
app.use(cors())
app.use(express.json({ limit: '1000mb' }))

app.use('/api/getcontent',require('./routes/fetchContent'))
app.use('/api/addpeople',require('./routes/addPeople'))

app.listen(port, ()=>{
    console.log(`Application started on Port : ${port}`);
})
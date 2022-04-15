const express = require('express')
const app = express()
const connectToMongo = require('./db')
connectToMongo()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors')
const fileUpload = require('express-fileupload')


app.use(cors())
app.use(express.json({ limit: '1000mb' }))
app.use(fileUpload({ useTempFiles : true,}));

app.use('/api/getcontent',require('./routes/fetchContent'))
app.use('/api/addpeople',require('./routes/addPeople'))
app.use('/api/uploadimg',require('./routes/testing'))

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.listen(port, ()=>{
    console.log(`Application started on Port : ${port}`);
})
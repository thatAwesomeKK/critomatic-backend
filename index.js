const express = require('express')
const app = express()
const connectToMongo = require('./db')
connectToMongo()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '1000mb' }))
app.use(fileUpload({ useTempFiles: true, }));

app.use('/api/auth', require('./routes/auth'))
app.use('/api/getcontent', require('./routes/fetchContent'))
app.use('/api/addpeople', require('./routes/addPeople'))
app.use('/api/addcontent', require('./routes/addContent'))
app.use('/api/storecontent', require('./routes/storeContent'))
app.use('/api/fetchprofile', require('./routes/fetchProfile'))
app.use('/api/addrating', require('./routes/addRating'))

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Application started on Port : ${port}`);
})
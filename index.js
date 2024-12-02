const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config();
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, " public", "try.html"));
})

app.listen(PORT, ()=>{
    console.log("Server is running on port 3000")
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }).then(()=>{
        console.log("MongoDB connected")
    }).catch((err)=>{
        console.log(err)
    })
});
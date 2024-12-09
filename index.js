const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRoute = require("./routes/user");
const bodyParser = require('body-parser')
const jobRoute = require('./routes/job')
const cors = require('cors')
dotenv.config();
app.use(cors());
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, " public", "try.html"));
})

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.json())
app.use('/api/user', userRoute)
app.use('/api/job', jobRoute)

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


const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const participantRoute=require('./routes/participantRouter');
const interviewRoute=require('./routes/interviewRouter');
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

var mongoDB = 'mongodb+srv://'+process.env.MONGO_USER_NAME+':'+process.env.MONGO_USER_PASS+'@cluster0.p4rym.mongodb.net/'+process.env.MONGO_DATABASE_NAME+'?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.use('/',participantRoute);
app.use('/interview',interviewRoute);
app.listen(5000,()=>{
    console.log("server is running on port 5000");
});
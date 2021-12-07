const express = require('express');
const mongoose = require('mongoose');
const participantRoute=require('./routes/participantRouter');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

var mongoDB = 'mongodb://127.0.0.1/test';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.use('/',participantRoute);
app.listen(5000,()=>{
    console.log("server is running on port 5000");
});
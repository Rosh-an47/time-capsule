require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db/index.js');
const app = express();

connectDB();

app.get('/', (req,res)=>{
    res.send("Time Capsule Server is Running");
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running in port ${process.env.PORT}`);
});
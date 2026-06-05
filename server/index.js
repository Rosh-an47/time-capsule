const express = require('express');

const app = express();

app.get('/', (req,res)=>{
    res.send("Time Capsule Server is Running");
});

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running in port ${PORT}`);
});
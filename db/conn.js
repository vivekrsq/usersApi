const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/deltacore")
.then(()=>{
    console.log("connection successfull")
}).catch((e)=>{
    console.log("not connected to db");
})
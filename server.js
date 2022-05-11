
require("dotenv").config();
const express = require('express');
const {engine}=require('express-handlebars');
const path = require('path');
const app = express();
const cors = require("cors")

const userRouter=require("./routes/userRoute")
const homeRouter=require("./routes/homeRoute")
const verbindeDB = require("./mongo-db");
const cookieParser = require("cookie-parser");

verbindeDB()


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.static('uploads'))
app.use(express.static('public'))

app.use("/user",userRouter)
app.use("/home",homeRouter)
app.get('*', (req,res, next) =>{
    res.status(404).send("Find not Path!")
   
    
  })
  
 
  
const port = process.env.PORT || 5000;

app.listen(port, () => { console.log("Port" + port) })


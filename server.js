
require("dotenv").config();
const session = require('express-session')

const express = require('express');
const {engine}=require('express-handlebars');
const path = require('path');
const app = express();
const cors = require("cors")
const MongoStore = require('connect-mongo');

const userRouter=require("./routes/userRoute")
const homeRouter=require("./routes/homeRoute")
const verbindeDB = require("./mongo-db");
//const cookieParser = require("cookie-parser");

verbindeDB()


app.use(express.json());
app.use(cors());
//app.use(cookieParser());
app.use(session({
  secret: process.env.sesseionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.mongo })
}))

app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.static('uploads'))
app.use(express.static('public'))

app.use("/user",userRouter)
app.use("/home",homeRouter)
app.get('*', (req,res)=>res.redirect("/home"))
  
 
  
const port = process.env.PORT || 5000;

app.listen(port, () => { console.log("Port" + port) })

//für run  node server.js und dann im browser http://localhost:5000/home/signup 

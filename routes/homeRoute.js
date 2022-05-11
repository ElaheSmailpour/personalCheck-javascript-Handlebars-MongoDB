
const express = require('express')

const router = express.Router()

const {homeForm}=require("../controller/homeController")


router.get("/homeseite",homeForm)




module.exports=router

const express = require('express')

const router = express.Router()

const {homeForm}=require("../controller/homeController")


router.get("/",homeForm)




module.exports=router
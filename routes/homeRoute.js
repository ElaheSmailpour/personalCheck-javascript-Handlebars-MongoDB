
const express = require('express')

const router = express.Router()

const {homeForm,startWork,endWork}=require("../controller/homeController")


router.get("/",homeForm)
router.get("/startWork",startWork)
router.get("/endWork",endWork)



module.exports=router
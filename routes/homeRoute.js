
const express = require('express')

const router = express.Router()

const {homeForm,startWork,endWork,startPause,endPause}=require("../controller/homeController")


router.get("/",homeForm)
router.get("/startWork",startWork)
router.get("/endWork",endWork)
router.get("/startPause",startPause)
router.get("/endPause",endPause)



module.exports=router
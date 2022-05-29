const mullterMiddelware=require("../middleware/multerMiddelware")
const express = require('express')

const router = express.Router()

const {homeForm,startWork,endWork,startPause,endPause,request}=require("../controller/homeController")


router.get("/",homeForm)
router.get("/startWork",startWork)
router.get("/endWork",endWork)
router.get("/startPause",startPause)
router.get("/endPause",endPause)

router.post("/request",mullterMiddelware.array("document",2),request)

module.exports=router
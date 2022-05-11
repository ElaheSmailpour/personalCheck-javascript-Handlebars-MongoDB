
const express = require('express')

const router = express.Router()

const {loginUser,signupUser, signupForm,loginForm}=require("../controller/userController")


router.post("/signup",signupUser)
router.get("/signup",signupForm)
router.post("/login",loginUser)
router.get("/login",loginForm)



module.exports=router
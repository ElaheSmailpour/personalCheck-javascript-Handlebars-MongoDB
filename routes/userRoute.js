
const express = require('express')

const router = express.Router()

const {loginUser,signupUser, signupForm,loginForm,logoutForm}=require("../controller/userController")


router.post("/signup",signupUser)
router.get("/signup",signupForm)
router.post("/login",loginUser)
router.get("/login",loginForm)

router.get("/logout",logoutForm)


module.exports=router
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const validateRegister = require("../validators/user.schema");
//login

exports.loginUser = async (req, res, next) => {
	let loginuser = req.body
	
	try {

		let user = await userModel.findOne({ username: loginuser.username })
		console.log(user);

		if (user === null) {
		
		return	res.render("login",{error:'incorrect username'})
		}

		let comparePasswort = await bcrypt.compare(loginuser.password, user.password)

		if (comparePasswort) {

			let token = jwt.sign({
				username: user.username,
				_id: user._id,
			}, process.env.JWT,{expiresIn:"1h"})
			res.status(200).json({
				message: 'You are log it',
				token: token,
				username: user.username,
				name:user.name

			})
		} else {
			
			return	res.render("login",{error:'incorrect password'})
		}
	} catch (error) {
		
		return	res.render("login",{error:'You could not be logged in'})
	}
}
//loginForm
exports.loginForm = async (req, res, next) => {

	res.render("login");
 }
//signup

exports.signupUser = async (req, res, next) => {

    try {
        const newuser = req.body
        const { error } = validateRegister.validate(newuser)
        if (error)
            return res.render("signup",{error})
        let alreadyuser = await userModel.find({ $or: [{ email: newuser.email }, { phone: newuser.phone }] })
        if (alreadyuser.length >= 1) {
            return res.render("signup",{error:'There is already a user with this email or phone'})
        }

        let passwortGehashed = await bcrypt.hash(newuser.password, 10)
        let createuser = await userModel.create({ ...newuser, password: passwortGehashed })


      res.render("signup");

    } catch (error) {
        console.log(error)
        res.render("signup",{error:'Something went wrong!'})
        console.log("signuperror=",error)
    }
}

//signupForm
exports.signupForm = async (req, res, next) => {

   res.render("signup");
}
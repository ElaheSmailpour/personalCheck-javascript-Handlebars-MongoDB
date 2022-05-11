const mongoose = require("mongoose")
const userPersonalSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password:String,
  email:String
 

})
const model = mongoose.model("userPersonal", userPersonalSchema)

module.exports = model
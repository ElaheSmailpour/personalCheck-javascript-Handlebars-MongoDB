const mongoose = require("mongoose")
const userPersonalSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password:String,
  email:String,
  status:{
    type:String,
    enum:["inWork","inPause","outWork"]
  }
 

})
const model = mongoose.model("userPersonal", userPersonalSchema)

module.exports = model
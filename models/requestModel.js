const mongoose = require("mongoose")
const requestSchema = new mongoose.Schema({
    typeRequest:{
        type:String,
        default: "sick",
        enum:["sick","holiday"]
      },
    from: String,
    until: String,
    description: String,
    documentsPicture: [String],
  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userPersonal"
    },

},{timestamps : true})
const model = mongoose.model("request", requestSchema)

module.exports = model
const mongoose = require("mongoose")
const userDaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userPersonal"
    },
    day: String,
    startTime: String,
    endTime: String,
    startPause: String,
    pauseDuration: {type : Number , default : 0}



})
const model = mongoose.model("userDay", userDaySchema)

module.exports = model
const mongoose = require("mongoose")
const userDaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userPersonal"
    },
    day: String,
    startTime: String,
    endTime: String,
    pauseDauration: Number



})
const model = mongoose.model("userDay", userDaySchema)

module.exports = model
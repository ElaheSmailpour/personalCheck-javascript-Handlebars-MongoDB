
const req = require("express/lib/request");
const moment = require("moment");
const User = require("../models/userModel")
const UserDayModel = require("../models/userDay")

function generateCurrentMonthDays() {
   let startDayOfMonth = moment().startOf("month")
   let endDayOfMonth = moment().endOf("month")

   while (true) {
      if (startDayOfMonth.format("ddd") === "Mon")
         break;
      startDayOfMonth = startDayOfMonth.add(-1, "d")
   }
   while (true) {
      if (endDayOfMonth.format("ddd") === "Sun")
         break;
      endDayOfMonth = endDayOfMonth.add(1, "d")
   }
   const daysOfCurrentMonth = []
   let indexDay = startDayOfMonth;
   daysOfCurrentMonth.push(indexDay.format("DD/MM/YYYY"))
   while (indexDay.format("YYYY/MM/DD") !== endDayOfMonth.format("YYYY/MM/DD")) {
      indexDay.add(1, "d")
      daysOfCurrentMonth.push(indexDay.format("DD/MM/YYYY"))
   }

   return daysOfCurrentMonth;

}

//home
exports.homeForm = async (req, res, next) => {

   const daysData = generateCurrentMonthDays()
   const findUser = await User.findById(req.session._id)

   if (req.session?.isLogin) {
      res.render("home", { days: daysData, startWorkDisabled: findUser?.status === "inWork", endWordDisabled: findUser?.status === "outWork",pauseStartDisabled: findUser?.status === "outWork" || findUser?.status === "inPause" });
   }
   else {
      res.redirect("/user/login")
   }
}


exports.startWork = async (req, res) => {
   const findUser = await User.findById(req.session._id)

   if (findUser) {
      const dayUser = await UserDayModel.findOne({ day: moment().format("DD/MM/YYYY"), user: findUser._id })

      if (dayUser) {
         res.redirect("/home?error=Already startWork!")
      } else {

         findUser.status = "inWork";
         await findUser.save();
         await UserDayModel.create({
            day: moment().format("DD/MM/YYYY"),
            user: findUser._id,
            startTime: moment().format("DD/MM/YYYY hh:mm")
         })
         res.redirect("/home")
      }

   }
   else {
      res.redirect("/user/logout")
   }
}
//endWork

exports.endWork = async (req, res) => {
   const findUser = await User.findById(req.session._id)

   if (findUser) {
      const dayUser = await UserDayModel.findOne({ day: moment().format("DD/MM/YYYY"), user: findUser._id })
      if (dayUser) {
         findUser.status = "outWork";
         dayUser.endTime = moment().format("DD/MM/YYYY hh:mm")
         await dayUser.save()
         await findUser.save();
      }


      res.redirect("/home")
   }
   else {
      res.redirect("/user/logout")
   }
}
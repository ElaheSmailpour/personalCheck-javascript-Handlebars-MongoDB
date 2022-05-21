
const req = require("express/lib/request");
const moment = require("moment");
const User = require("../models/userModel")
const UserDayModel = require("../models/userDay")
const { FORMAT_DAY, FORMAT_TIME, FORMAT_DATE_TIME } = require("../utils/dataTime")



function generateCurrentMonthDays(month) {
   let startDayOfMonth = moment().startOf("month")
   let endDayOfMonth =moment().endOf("month")
   if(month!==undefined){

      startDayOfMonth.set("M",month)
      endDayOfMonth.set("M",month)

   }
   
 

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
   daysOfCurrentMonth.push(indexDay.format(FORMAT_DAY))
   while (indexDay.format(FORMAT_DAY) !== endDayOfMonth.format(FORMAT_DAY)) {
      indexDay.add(1, "d")
      daysOfCurrentMonth.push(indexDay.format(FORMAT_DAY))
   }

   return daysOfCurrentMonth;

}

//home
exports.homeForm = async (req, res, next) => {
   const month = req.query.month;
   
   const daysData = generateCurrentMonthDays(month )
   const findUser = await User.findById(req.session._id)
   const userDaysWork = await UserDayModel.find({ user: req.session._id })
   const daysAllInfo = [];
   for (let i = 0; i < daysData.length; i++) {
      const day = daysData[i];
      const founddayWork = await userDaysWork.find(item => item.day === day)
      daysAllInfo.push({
         dayWork: day,
         startTime: founddayWork?.startTime && moment(founddayWork?.startTime, FORMAT_DATE_TIME).format(FORMAT_TIME),
         endTime: founddayWork?.endTime && moment(founddayWork?.endTime, FORMAT_DATE_TIME).format(FORMAT_TIME)
      })
   }
   if (req.session?.isLogin) {
      res.render("home", {
         username: findUser.name,
          days: daysAllInfo,
           startWorkDisabled: findUser?.status === "inWork",
            endWordDisabled: findUser?.status === "outWork",
             pauseStartDisabled: findUser?.status === "outWork" || findUser?.status === "inPause",
             currentMonth : moment().format("MMM YYYY"),
             nextMonthNumber : moment().month()+1,
             lastMonthNumber : moment().month()-1
      });
   }
   else {
      res.redirect("/user/login")
   }
}


exports.startWork = async (req, res) => {
   const findUser = await User.findById(req.session._id)

   if (findUser) {
      const dayUser = await UserDayModel.findOne({ day: moment().format(FORMAT_DAY), user: findUser._id })

      if (dayUser) {
         res.redirect("/home?error=Already startWork!")
      } else {

         findUser.status = "inWork";
         await findUser.save();
         await UserDayModel.create({
            day: moment().format(FORMAT_DAY),
            user: findUser._id,
            startTime: moment().format(FORMAT_DATE_TIME)
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
      console.log({ day: moment().format(FORMAT_DAY), user: findUser._id });
      const dayUser = await UserDayModel.findOne({ day: moment().format(FORMAT_DAY), user: findUser._id })
      if (dayUser) {
         findUser.status = "outWork";
         dayUser.endTime = moment().format(FORMAT_DATE_TIME)
         await dayUser.save()
         await findUser.save();
         res.redirect("/home")
      }
      else {
         res.redirect("/home?error=find not day !")
      }


   }
   else {
      res.redirect("/user/logout")
   }
}
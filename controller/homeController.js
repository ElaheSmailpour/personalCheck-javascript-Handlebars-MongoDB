
const req = require("express/lib/request");
const moment = require("moment");
const User = require("../models/userModel")
const UserDayModel = require("../models/userDay")
const RequestModel = require("../models/requestModel")
const { FORMAT_DAY, FORMAT_TIME, FORMAT_DATE_TIME, FORMAT_DATE_TIME_FULL } = require("../utils/dataTime");
const { create } = require("connect-mongo");



function generateCurrentMonthDays(date) {
   let startDayOfMonth = moment(date, FORMAT_DAY).startOf("month")
   let endDayOfMonth = moment(date, FORMAT_DAY).endOf("month")

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
   const date = req.query.date || moment().format(FORMAT_DAY);

   const daysData = generateCurrentMonthDays(date)
   const findUser = await User.findById(req.session._id)
   const userDaysWork = await UserDayModel.find({ user: req.session._id })
   const daysAllInfo = [];
   for (let i = 0; i < daysData.length; i++) {
      const day = daysData[i];
      const founddayWork = await userDaysWork.find(item => item.day === day)
      daysAllInfo.push({
         dayWork: day,
         startTime: founddayWork?.startTime && moment(founddayWork?.startTime, FORMAT_DATE_TIME).format(FORMAT_TIME),
         endTime: founddayWork?.endTime && moment(founddayWork?.endTime, FORMAT_DATE_TIME).format(FORMAT_TIME),
         pauseDuration: founddayWork?.pauseDuration && Math.floor(founddayWork?.pauseDuration / 60)

      })
   }
   if (req.session?.isLogin) {
      res.render("home", {
         username: findUser.name,
         days: daysAllInfo,
         startWorkDisabled: findUser?.status !== "outWork",
         //eli // startWorkDisabled: findUser?.status ==="outWork" || findUser?.status === "inWork",
         endWorkDisabled: findUser?.status !== "inWork",
         pauseStartDisabled: findUser?.status === "outWork" || findUser?.status === "inPause",

         pauseEndDisabled: findUser?.status !== "inPause",
         currentMonth: moment(date, FORMAT_DAY).format("MMM YYYY"),
         nextMonthNumber: moment(date, FORMAT_DAY).add(1, "M").format(FORMAT_DAY),
         lastMonthNumber: moment(date, FORMAT_DAY).add(-1, "M").format(FORMAT_DAY),
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

module.exports.startPause = async (req, res) => {
   const findUser = await User.findById(req.session._id)

   if (findUser) {
      const dayUser = await UserDayModel.findOne({ day: moment().format(FORMAT_DAY), user: findUser._id })
      if (dayUser) {
         findUser.status = "inPause";
         dayUser.startPause = moment().format(FORMAT_DATE_TIME_FULL)
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
module.exports.endPause = async (req,res)=>{
   const findUser = await User.findById(req.session._id)

   if (findUser) {
      const dayUser = await UserDayModel.findOne({ day: moment().format(FORMAT_DAY), user: findUser._id })
      if (dayUser) {
         findUser.status = "inWork";
         dayUser.pauseDuration += Math.floor(moment.duration(moment().diff(moment(dayUser.startPause,FORMAT_DATE_TIME_FULL))).as("s"))
         dayUser.startPause = undefined;
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
//request 
module.exports.request = async (req, res) => {
   const body = req.body
   console.log("files=",req.files)
   const createRequest = await RequestModel.create({
      typeRequest: body.typeRequest, from: moment(body.from,"D.M.YYYY").format(FORMAT_DAY), until:  moment(body.until,"D.M.YYYY").format(FORMAT_DAY),
      description: body.description, user: req.session._id,
      documentsPicture:req.files.map(item=>item.filename)
   })
   res.redirect("/home")
}
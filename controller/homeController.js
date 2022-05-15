
const moment = require("moment");


//home
exports.homeForm = async (req, res, next) => {
   const currentMonth = moment().month() + 1
   const currentYear = moment().year();

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


   console.log(daysOfCurrentMonth);
   if (req.session?.isLogin) {
      res.render("home",{days:daysOfCurrentMonth});
   }
   else {
      res.redirect("/user/login")
   }
}
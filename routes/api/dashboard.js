const { returnResponse } = require("../../helper/response.helper");
const {
  getTotalGuestUserAddedToday,
  getTotalUsersByRole,
  getHourlyCallCount,
  getTotalCallDurationToday,
  getTotalCallDuration,
  getTotalCall,
  getGenderWiseCall,
} = require("../../helper/dashboard.helper");

const router = require("express").Router();
const currentDate = new Date();
const startOfDay = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate()
);
router.get("/data", async function (req, res, next) {
  try {
    let finalData = {
      users: {
        total: {},
        totalToday: 0,
      },
      messages: {
        total: 0,
        totalToday: 0,
      },
      call: {
        total: 0,
        duration: 0,
        durationToday: 0,
        totalToday: 0,
        callLineChart: {},
        recentCallLogs: [],
      },
    };
    // { $gt: new Date(new Date(startDate).setHours(00, 00, 00)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }
    let totalUserCount = await getTotalUsersByRole();
    const totalGuestUserAddedToday = await getTotalGuestUserAddedToday();

    let hourCount = await getHourlyCallCount();

    // total call duration up to now
    let totalCallDurationToday = await getTotalCallDurationToday();

    let totalCallDuration = await getTotalCallDuration();

    // const recentCallLogs =

    // await NSPH_DB.CallLog.create(dummyData);

    let totalMessages = await NSPH_DB.Messages.find().countDocuments();

    let totalMessagesToday = await NSPH_DB.Messages.find({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }).countDocuments();

    let totalCall = await getTotalCall();

    let genderWiseCallCount = await getGenderWiseCall();
    finalData.call.genderWiseCallCount = genderWiseCallCount;
    let totalCallToday = await NSPH_DB.CallLog.find({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }).countDocuments();
    finalData.users.total = totalUserCount;
    finalData.users.totalToday = totalGuestUserAddedToday[0]?.count || 0;
    finalData.call.duration = totalCallDuration;
    finalData.call.durationToday = totalCallDurationToday;
    finalData.messages.total = totalMessages;

    finalData.messages.totalToday = totalMessagesToday;
    finalData.call.totalToday = totalCallToday;
    finalData.call.total = totalCall?.length;
    finalData.call.callLineChart = hourCount;
    finalData.call.recentCallLogs = totalCall?.slice(0, 5);
    // write mongoose query to get total users, total call logs, total messages of today

    //total call logs

    return returnResponse(res, genderWiseCallCount);
    //write mongodb query to get total users, total call logs, total messages
    // write mongodb aggregate function to get total users and the total users added today
  } catch (err) {
    console.log("errors is", err);
    next(err);
  }
});

module.exports = router;

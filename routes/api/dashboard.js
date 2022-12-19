const { returnResponse } = require("../../helper/response.helper");

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
    let totalUsers = await NSPH_DB.Users.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "roles",
          foreignField: "_id",
          as: "roles",
        },
      },

      { $unwind: { path: "$roles" } },
      { $match: { "roles.name": { $in: ["Facilitator", "Guest"] } } },
      {
        $group: {
          _id: { name: "$roles.name", _id: "$roles._id" },
          count: { $sum: 1 },
          // users: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id._id": 1 } },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          _id: "$_id._id",
          count: 1,
          // users: 1,
        },
      },
    ]);

    //   total users accordint to roles
    let totalUserCount = {
      Facilitator: 0,
      Guest: 0,
    };

    totalUsers.forEach((user) => {
      totalUserCount[user.name] = user.count;
    });
    const totalGuestUserAddedToday = await NSPH_DB.Users.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // Match only documents created today
        },
      },
      {
        $lookup: {
          from: "roles", // Collection to join
          localField: "roles", // Field in the input documents
          foreignField: "_id", // Field in the joined documents
          as: "roles", // Output array field
        },
      },
      {
        $unwind: "$roles", // Unwind the roles array
      },
      {
        $match: {
          "roles.name": "Guest", // Match only documents with the "guest" role
        },
      },
      {
        $group: {
          _id: 0, // Group all documents together
          count: { $sum: 1 }, // Count the number of documents in the group
        },
      },
    ]);

    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    let timeInterval = {
      "12AM": {
        // 12AM - 4AM
        start: new Date(startOfDay.getTime() + 0 * 60 * 60 * 1000),
        end: new Date(startOfDay.getTime() + 4 * 60 * 60 * 1000),
      },
      "4AM": {
        // 4AM - 8AM
        start: new Date(startOfDay.getTime() + 4 * 60 * 60 * 1000),
        end: new Date(startOfDay.getTime() + 8 * 60 * 60 * 1000),
      },
      "8AM": {
        // 8AM - 12PM
        start: new Date(startOfDay.getTime() + 8 * 60 * 60 * 1000),
        end: new Date(startOfDay.getTime() + 12 * 60 * 60 * 1000),
      },
      "12PM": {
        // 12PM - 4PM
        start: new Date(startOfDay.getTime() + 12 * 60 * 60 * 1000),
        end: new Date(startOfDay.getTime() + 16 * 60 * 60 * 1000),
      },
      "4PM": {
        // 4PM
        start: new Date(startOfDay.getTime() + 16 * 60 * 60 * 1000),
        end: new Date(startOfDay.getTime() + 20 * 60 * 60 * 1000),
      },
      "8PM": {
        // 8PM - 12AM
        start: new Date(startOfDay.getTime() + 20 * 60 * 60 * 1000),
        end: new Date(startOfDay.getTime() + 0 * 60 * 60 * 1000),
      },
    };

    let hourCount = {};
    const hourlyCall = await NSPH_DB.CallLog.find({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    hourlyCall.forEach((call) => {
      let curDateHour = new Date(call.date);
      Object.keys(timeInterval).forEach((key) => {
        if (!hourCount[key]) {
          hourCount[key] = 0;
        }

        // special case for 8PM - 12AM
        if (key === "8PM") {
          if (
            curDateHour >= timeInterval[key].start ||
            curDateHour < timeInterval[key].end
          ) {
            if (hourCount[key]) {
              hourCount[key] = hourCount[key] + 1;
            } else {
              hourCount[key] = 1;
            }
          }
        }

        // ohter cases
        if (
          curDateHour >= timeInterval[key].start &&
          curDateHour < timeInterval[key].end
        ) {
          if (hourCount[key]) {
            hourCount[key] = hourCount[key] + 1;
          } else {
            hourCount[key] = 1;
          }
        }
      });
    });

    // total call duration up to now
    let totalCallDurationToday = await NSPH_DB.CallLog.aggregate([
      {
        $match: {
          date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      },
      {
        $group: {
          _id: null,
          totalCallTime: { $sum: "$totalTime" },
        },
      },
    ]);
    let totalCallDuration = await NSPH_DB.CallLog.aggregate([
      {
        $group: {
          _id: null,
          totalCallTime: { $sum: "$totalTime" },
        },
      },
    ]);

    // const recentCallLogs =

    // await NSPH_DB.CallLog.create(dummyData);

    let totalMessages = await NSPH_DB.Messages.find().countDocuments();
    let totalMessagesToday = await NSPH_DB.Messages.find({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }).countDocuments();

    let totalCall = await NSPH_DB.CallLog.find()
      .populate([
        {
          path: "callFrom",
          select: "username",
        },
        {
          path: "callTo",
          select: "username",
        },
        {
          path: "shift",
          select: "title",
        },
        {
          path: "user",
          select: "username gender",
        },
      ])
      .sort({ createdAt: -1 });

    let genderWiseCall = await NSPH_DB.CallLog.aggregate([
      {
        $lookup: {
          from: "users", // Collection to join
          localField: "user", // Field in the input documents
          foreignField: "_id", // Field in the joined documents
          as: "user", // Output array field
        },
      },
      {
        $unwind: { path: "$user" },
      },
      // {
      //   $match: {
      //     "user.gender": {$in: ["Male", "Female", "Other"]}
      //   }
      // },
      {
        $group: {
          _id: "$user.gender",
          count: { $sum: 1 },
        },
      },
    ]);

    let genderWiseCallCount = {};

    genderWiseCall.forEach((call) => {
      if (!genderWiseCallCount[call._id]) {
        // adding total count
        if (genderWiseCallCount["total"]) {
          genderWiseCallCount["total"] =
            genderWiseCallCount["total"] + call.count;
        } else {
          genderWiseCallCount["total"] = call.count;
        }
        genderWiseCallCount[call._id] = call.count;
      }
    });
    finalData.call.genderWiseCallCount = genderWiseCallCount;
    let totalCallToday = await NSPH_DB.CallLog.find({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }).countDocuments();
    finalData.users.total = totalUserCount;
    finalData.users.totalToday = totalGuestUserAddedToday[0]?.count || 0;
    finalData.call.duration = totalCallDuration[0]?.totalCallTime;
    finalData.call.durationToday = totalCallDurationToday[0]?.totalCallTime;
    finalData.messages.total = totalMessages;

    finalData.messages.totalToday = totalMessagesToday;
    finalData.call.totalToday = totalCallToday;
    finalData.call.total = totalCall?.length;
    finalData.call.callLineChart = hourCount;
    finalData.call.recentCallLogs = totalCall.slice(0, 5);
    // write mongoose query to get total users, total call logs, total messages of today

    //total call logs

    return returnResponse(res, finalData);
    //write mongodb query to get total users, total call logs, total messages
    // write mongodb aggregate function to get total users and the total users added today
  } catch (err) {
    console.log("errors is", err);
    next(err);
  }
});

module.exports = router;

const getTotalUsersByRole = async function () {
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

  return totalUserCount;
};

const getTotalGuestUserAddedToday = async function () {
  const data = await NSPH_DB.Users.aggregate([
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

  return data;
};

const getHourlyCallCount = async function () {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    let hourCount = {};
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
    return hourCount;
  } catch (err) {
    console.log(err);
    return {};
  }
};

const getTotalCallDurationToday = async function () {
  try {
    const data = await NSPH_DB.CallLog.aggregate([
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

    return data[0]?.totalCallTime || 0;
  } catch (error) {}
};

const getTotalCallDuration = async function () {
  try {
    const data = await NSPH_DB.CallLog.aggregate([
      {
        $group: {
          _id: null,
          totalCallTime: { $sum: "$totalTime" },
        },
      },
    ]);

    return data[0]?.totalCallTime || 0;
  } catch (error) {}
};

const getTotalCall = async function () {
  try {
    const data = await NSPH_DB.CallLog.find()
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
      .sort({ createdAt: -1 })
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getGenderWiseCall = async function () {
  try {
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
        {
          $match: {
            "user.gender": {$in: ["Male", "Female", "Other"]}
          }
        },
        {
          $group: {
            _id: "$user.gender",
            count: { $sum: 1 },
          },
        },
      ]);
      
      console.log("gender wise call ", genderWiseCall)
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

      return genderWiseCallCount;
  } catch (error) {}
};

module.exports = {
  getTotalGuestUserAddedToday,
  getTotalUsersByRole,
  getHourlyCallCount,
  getTotalCallDurationToday,
  getTotalCallDuration,
  getTotalCall,
  getGenderWiseCall
};

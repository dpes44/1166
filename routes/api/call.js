// routes/api/books.js
const express = require("express");
const { returnResponse } = require("../../helper/response.helper");
const router = express.Router();
const livekitApi = require("livekit-server-sdk");
const AccessToken = livekitApi.AccessToken;

router.post("/add", async function (req, res, next) {
  try {
    const facilitator = await NSPH_DB.Users.findById(req.body.facilitator);
    if (!facilitator) {
      throw {
        status: 404,
        msg: "Facilitator not found.",
      };
    }

    const customer = await NSPH_DB.Users.findOne({
      username: req.body.customerUserName,
    });

    if (!customer) {
      throw { status: 404, msg: "User not found." };
    }

    if (req.body.callFrom == "facilitator") {
      req.body.callFrom = facilitator._id;
      req.body.callTo = customer._id;
    } else {
      req.body.callFrom = customer._id;
      req.body.callTo = facilitator._id;
    }

    customer.firstname = req.body.firstname;
    customer.middlename = req.body.middlename;
    customer.lastname = req.body.lastname;
    customer.gender = req.body.gender;;
    customer.address = req.body.address;
    customer.phone = req.body.phone;
    await customer.save();

    const callLog = await NSPH_DB.CallLog.create({
      facilitator: facilitator._id,
      user: customer._id,
      shift: req.body.shift,
      date: req.body.callStartDate,
      callFrom: req.body.callFrom,
      callTo: req.body.callTo,
      duration: req.body.duration,
      comment: req.body.comment,
      callType: req.body.callType,
      occupation: req.body.occupation,
      maritalStatus: req.body.maritalStatus,
      vulnerability: req.body.vulnerability,
      callType: req.body.callType,
      sucide: req.body.sucide,
      phoneOfSignificantOther: req.body.phoneOfSignificantOther,
      relation: req.body.relation,
      service: req.body.service,
      referralTo: req.body.referralTo,
      referralFrom: req.body.referralFrom,
      caller: req.body.caller,
      supportThrough: req.body.supportThrough,
      note: req.body.note,
      totalTime: req.body.totalTime,
    }); 
    res.json(callLog);
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

router.get("/user", async function (req, res, next) {
  try {
    const user = await NSPH_DB.Users.findOne({
      username: req.query.username,
    });

    // const callType = await NSPH_DB.CallLog.findOne({

    //   user: user._id,
    // }).populate([
    //   {
    //     path: "facilitator",
    //     select: "firstname middlename lastname username",
    //   },
    //   {
    //     path: "user",
    //     select:
    //       "firstname middlename lastname email username gender province ageGroup gender",
    //   },
    //   {
    //     path: "shift",
    //     select: "title",
    //   },
    //   {
    //     path: "callType",
    //     select: "title",
    //   },
    // ]);
    console.log("call user is", user);
    res.json(user);
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

router.get("/data", async function (req, res, next) {
  try {
    const ageGroups = await NSPH_DB.AgeGroup.find();
    const callTypes = await NSPH_DB.CallType.find();
    const shifts = await NSPH_DB.Shift.find();

    return returnResponse(res, {
      ageGroups: ageGroups,
      callTypes: callTypes,
      shifts: shifts,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/list", async function (req, res, next) {
  try {
    let page = 1;
    let limit = 15;
    let filters = {};
    let query = req.query;
    if (query.facilitator) {
      filters.facilitator = query.facilitator;
    }
    if (query.user) {
      filters.user = query.user;
    }
    if (query.callType) {
      filters.callType = query.callType;
    }
    if (query.shift) {
      filters.shift = query.shift;
    }

    if (query.page) {
      page = parseInt(query.page);
    }
    let skip = (page - 1) * limit;
    // if (query.date) {
    //   filters.date = query.date;
    // }

    // const check = await NSPH_DB.CallLog.getCallLogGropedByFacilitator("6364dada7887be4148c439e8");
    // console.log("check is", check);

    // // const letcheck = await NSPH_DB.CallLog.aggregate([
    // //   {
    // //     $match: {
    // //       user: "6364dada7887be4148c439e8",
    // //     },
    // //   },
    // //   {
    // //     $lookup: {
    // //       from: "facilitator",
    // //       localField: "facilitator",
    // //       foreignField: "_id",
    // //       as: "facilitator",
    // //     },
    // //   },
    // //   {
    // //     $group: {
    // //       _id: "$facilitator._id",
    // //       count: { $sum: 1 },
    // //       calls: {$push: "$$ROOT"}
    // //     }
    // //   },{
    // //     $project: {
    // //       _id: 0,
    // //       facilitator: "$_id",
    // //       calls: 1,
    // //       count: 1,
    // //     }
    // //   }
    // // ])

    const count = await NSPH_DB.CallLog.countDocuments(filters);
    const data = await NSPH_DB.CallLog.find(filters)
      .limit(limit)
      .skip(skip)
      .populate([
        {
          path: "facilitator",
          select: "username",
        },
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
      ]);

      return returnResponse(res, {
      data: data,
      count: count,
      page: page,
    });
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

router.get("/facilitator", async function (req, res, next) {
  try {
    const check = await NSPH_DB.CallLog.getCallLogGropedByFacilitator(
      req.user._id
    );

    return returnResponse(res, check);
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

router.get("/:roomName", async function (req, res, next) {
  try {
    // if this room doesn't exist, it'll be automatically created when the first
    // client joins
    const roomName = req.params.roomName;
    // identifier to be used for participant.
    // it's available as LocalParticipant.identity with livekit-client SDK
    const participantName = "user-name" + Math.floor(Math.random() * 1000);

    const at = new AccessToken("devkey", "secret", {
      identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName });

    const token = at.toJwt();
    res.json({ token: token });
  } catch (err) {
    console.log("error is", err);
  }
});
module.exports = router;

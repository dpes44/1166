// routes/api/books.js
const express = require("express");
const router = express.Router();

router.post("/add", async function (req, res, next) {
  try {
    console.log("req.body is",req.body)
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

    let oldUser = await NSPH_DB.Users.findOne({email: req.body.email});
    if(oldUser){
        throw {status: 400, msg:"Email already registered."}
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
    customer.email = req.body.email;
    await customer.save();
    const callLog = await NSPH_DB.CallLog.create({
      facilitator: facilitator._id,
      user: customer._id,
      date: req.body.callStartDate,
      callFrom: req.body.callFrom,
      callTo: req.body.callTo,
      duration: req.body.duration,
      comment: req.body.comment,
      callType: req.body.callType,
    });

    res.json(callLog);
  } catch (err) {
    next(err);
  }
});

router.get("/user", async function(req,res,next){
    try{
        const callType = await NSPH_DB.CallType.find({
            username: req.params.username
        }) .populate([
            {
              path: "facilitator",
              select: "firstname middlename lastname",
            },
            {
              path: "user",
              select: "firstname middlename lastname email",
            },
            {
              path: "shift",
              select: "title",
            },
            {
              path: "ageGroup",
              select: "title",
            },
            {
              path: "callType",
              select: "title",
            },
          ])
        if(!callType){
            throw {status: 404, msg: "Call not found."}
        }
        res.json(callType);
    }catch(err){
        next(err)
    }
})

router.get("/data", async function (req, res, next) {
    try{
        const ageGroups = await NSPH_DB.AgeGroup.find();
        const callTypes = await NSPH_DB.CallType.find();
        const shifts = await NSPH_DB.Shift.find();
        res.json({
            ageGroups: ageGroups,
            callTypes: callTypes,
            shifts: shifts
        })
    }catch(err){
        next(err)
    }
});
module.exports = router;

// models/User.js

const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    facilitator: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    totalTime: {
      type: Number,
      required: [true, "Total time is required"],
    },
    date: {
      type: Date,
    },
    address: {
      type: String,
    },
    occupation: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    vulnerability: {
      type: String,
    },
    callType: {
      type: String,
    },
    sucide: {
      type: String,
    },
    phoneOfSignificantOther: {
      type: String,
    },
    relation: {
      type: String,
    },
    service: { type: String },
    referralTo: { type: String },
    referralFrom: { type: String },
    caller: { type: String },
    supportThrough: { type: String },
    callFrom: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    callTo: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    shift: { type: mongoose.Types.ObjectId, ref: "shift", required: false },
    note: {
      type: String,
    },
    callType: {
      type: String,
    },
    // callType: [{ type: mongoose.Types.ObjectId, ref: "calltype" }],
  },
  {
    timestamps: true,
  }
);

CallLogSchema.statics.getCallLogGropedByFacilitator = async function (userId) {
  return await this.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    // {
    //   $group: {
    //     _id: "$facilitator",
    //     count: { $sum: 1 },
    //   },
    // },
  ])
};

module.exports = CallLog = mongoose.model("calllog", CallLogSchema);

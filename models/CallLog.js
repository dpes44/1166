// models/User.js

const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    facilitator: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    duration: {
      type: String,
      required:[true, "Duration is required"]
    },
    date: {
      type: Date,
    },
    callFrom: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    callTo: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    comment: {
      type: String,
    },
    callType: [{ type: mongoose.Types.ObjectId, ref: "calltype" }],
  },
  {
    timestamps: true,
  }
);

module.exports = CallLog = mongoose.model("calllog", CallLogSchema);

// models/User.js

const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    facillator: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    duration: {
      type: Number,
    },
    callFrom: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    callTo: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    date: {
      type: Date,
      default: Date.now,
    },
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

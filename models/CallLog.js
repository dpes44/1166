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

CallLogSchema.statics.paginate = async function (query) {
  try {
    
    const {
      query = {},
      limit = 5,
      page = 1,
      sort = {},
      populate,
      fields,
    } = query;
  
    let output = {
      total: 0,
      page: page < 1 ? 1 : parseInt(page),
      limit: limit < 1 ? 1 : parseInt(limit),
      data: [],
    }

    const skip = (output.page - 1) * output.limit;

    const total = await this.countDocuments(query);
    const data = await this.find(query, fields)
  
    output.total = total;
  } catch (error) {
    console.log("error is", error)
    return []
  }

};

module.exports = CallLog = mongoose.model("calllog", CallLogSchema);

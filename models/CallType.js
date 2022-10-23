// models/User.js
 
const mongoose = require("mongoose");

const CallTypeSchema = new mongoose.Schema(
  {
   title:{
    type:String,
    required:[true,"Title is required."]
   }
  },
  {
    timestamps: true,
  }
);

module.exports = CallTypes = mongoose.model("calltype", CallTypeSchema);

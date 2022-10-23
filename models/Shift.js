// models/User.js
 
const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema(
  {
   title:{
    type:String,
    required:[true, ["Shift name is required."]]
   },
   start:{
    type:String,
    required:[true, ["Start time is required."]]
   },
   startAbbreviation: {
    type:String,
    required:[true, "Please select AM or PM"],
    enum:["AM","PM" ]
   },
   end:{
    type:String,
    required:[true, ["End Time is required."]]
   },
   endAbbreviation: {
    type:String,
    required:[true, "Please select AM or PM"],
    enum:["AM","PM"]
   },
  },
  {
    timestamps: true,
  }
);

module.exports = Shift = mongoose.model("shift", ShiftSchema);

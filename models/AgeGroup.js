// models/User.js
 
const mongoose = require("mongoose");

const AgeGroupSchema = new mongoose.Schema(
  {
   title:{
    type:String,
    required:[true,"title of age group is required."]
   },
   from:{
    type:Number,
    required:[true, ["from age is required."]]
   },
   to:{
    type:Number,
    required:[true, ["To age is required."]]
   },
  },
  {
    timestamps: true,
  }
);

module.exports = AgeGroup = mongoose.model("agegroup", AgeGroupSchema);

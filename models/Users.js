// models/User.js

const mongoose = require("mongoose");
const Role = require("./Role");
const Permission = require("./Permission");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    middlename: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    googleTokenId: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    facebookId: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Pending"],
      default: "Active",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      },
      province: {
        type:String,
      },
    ageGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agegroup"
      },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
        required: false,
      },
    ],
    permission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("user", UserSchema);

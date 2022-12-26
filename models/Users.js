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
    socketId: {
      type: String,
      unique: true,
      required: false,
      sparse: true,
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
      select: false,
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
    isFacebook: {
      type: Boolean,
      default: false,
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
      type: String,
    },
    age: {
      type: Number,
    },
    onlineStatus: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    // ageGroup: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "agegroup",
    // },
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
    notification: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add function
UserSchema.statics.getSocketId = function (_id) {
  const User = this;
  return User.findOne({ _id: _id }).then((user) => {
    if (user) {
      return user.socketId;
    }
    return null;
  });
};

module.exports = User = mongoose.model("user", UserSchema);

// models/User.js

const mongoose = require("mongoose");

const UserLocationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserLocation = mongoose.model(
  "userLocation",
  UserLocationSchema
);

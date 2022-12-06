// models/User.js

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "sender is required"],
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "receiver is required"],
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "url"],
      default: "text",
    },
    body: {
      type: String,
    },
    // seenAt time stamp 
    seen: {
      type: Date,
      required: false,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Message = mongoose.model("message", MessageSchema);

// models/User.js

const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    userOne: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "sender is required"],
    },
    userTwo: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "receiver is required"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = ChatList = mongoose.model("chatList", ChatSchema);

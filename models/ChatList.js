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

// add function 
ChatSchema.statics.findOrCreate = function (userOne, userTwo) {
  const Chat = this;
  return Chat.findOne({
    $or: [
      { userOne: userOne, userTwo: userTwo },
      { userOne: userTwo, userTwo: userOne },
    ],
  }).then((chat) => {
    if (chat) {
      return chat;
    }
    return Chat.create({
      userOne: userOne,
      userTwo: userTwo,
    });
  });
};

module.exports = ChatList = mongoose.model("chatList", ChatSchema);

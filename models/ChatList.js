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
    },

  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      setters: true,
    }
  },
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


ChatSchema.statics.getChatList = function (_id) {
  const Chat = this;
  return Chat.find({
    $or: [
      { userOne: _id },
      { userTwo: _id },
    ],
  }).populate(["userOne", "userTwo"]).sort({ createdAt: "desc" }).then((chats) => {
    return chats.map((chat) => {
      if (chat.userOne._id.toString() === _id.toString()) {
        return chat.userTwo;
      }
      return chat.userOne;
    });
  });
};

// ChatSchema.set('toJson', { virtual: true })



module.exports = ChatList = mongoose.model("chatList", ChatSchema);

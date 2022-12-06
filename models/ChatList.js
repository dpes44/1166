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
    message: {
      type: mongoose.Types.ObjectId,
      ref: "message",
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      setters: true,
    },
  }
);

// add function
ChatSchema.statics.createOrUpdate = function (userOne, userTwo, message) {
  const Chat = this;
  return Chat.findOne({
    $or: [
      { userOne: userOne, userTwo: userTwo },
      { userOne: userTwo, userTwo: userOne },
    ],
  }).then(async (chat) => {
    if (chat) {
      chat.message = message;
      return await chat.save();
      return chat;
    }
    return Chat.create({
      userOne: userOne,
      userTwo: userTwo,
      message,
    });
  });
};

ChatSchema.statics.getChatList = function (_id) {
  const Chat = this;
  return Chat.find({
    $or: [{ userOne: _id }, { userTwo: _id }],
  })
    .populate(["userOne", "userTwo", "message"])
    .sort({ createdAt: "desc" })
    .then((chats) => {
      return chats.map((chat) => {
        if (chat.userOne._id.toString() === _id.toString()) {
          return {
            _id: chat.userTwo._id,
            username: chat.userTwo.username,
            firstname: chat.userTwo.firstname,
            lastname: chat.userTwo.lastname,
            middlename: chat.userTwo.middlename,
            onlineStatus: chat.userTwo.onlineStatus,
            lastMessage: chat.message,
          }
        } else {
          return {
            _id: chat.userOne._id,
            username: chat.userOne.username,
            firstname: chat.userOne.firstname,
            lastname: chat.userOne.lastname,
            middlename: chat.userOne.middlename,
            onlineStatus: chat.userOne.onlineStatus,
            lastMessage: chat.message,
          }
        }
      });
    });
};

// ChatSchema.set('toJson', { virtual: true })

module.exports = ChatList = mongoose.model("chatList", ChatSchema);

// models/User.js

const mongoose = require("mongoose");
const sendNotification = require("../helper/notification.helper");

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
      default: "text",
    },
    body: {
      type: String,
    },
    // seenAt time stamp
    seen: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.post("save", async function (doc, next) {
  // emit message to  user
  let newMsg = doc.toObject();
  newMsg["senderDetail"] = await NSPH_DB.Users.findById(
    doc.sender,
    "username status firstname lastname email"
  );

  sendNotification(newMsg, doc.receiver);
});

module.exports = Message = mongoose.model("message", MessageSchema);

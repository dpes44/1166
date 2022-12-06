const jwt = require("jsonwebtoken");
const socket = require("socket.io");
const { getUserFromToken } = require("./helper/token");
const { checkTokenMiddleware } = require("./middleware/socket");
module.exports = function (server) {
  const io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.use(checkTokenMiddleware);

  io.on("connection", async (socket) => {
    // updated user with new socket id only at new connection
    console.log("connected")
    socket.user.socketId = socket.id;
    await socket.user.save();

    socket.on("send-msg", async (data) => {
      console.log("message data is ", data);
      // create message
      const message = await NSPH_DB.Messages.create({
        sender: data.from || data.sender,
        receiver: data.to || data.receiver,
        body: data.message || data.body,
      });
      console.log("message is ", message);
      console.log(
        "socket id is ",
        await NSPH_DB.Users.getSocketId(data.to || data.receiver)
      );
      // emit message to  user
      io.to(await NSPH_DB.Users.getSocketId(data.to || data.receiver)).emit(
        "receive-msg",
        message
      );
      // find or create chat list
      const chatList = await NSPH_DB.ChatList.createOrUpdate(
        data.from || data.sender,
        data.to || data.receiver,
        message._id
      );
    });

    socket.on("call", async (data) => {
      console.log("call", data);
      // let callee = data.name;
      let rtcMessage = data.rtcMessage;

      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("newCall", {
          from: data.from,
          to: data.to,
          caller: socket.user,
          rtcMessage: rtcMessage,
        });
    });

    socket.on("answerCall", async (data) => {
      console.log("Answer Call", data);
      // let caller = data.caller;
      rtcMessage = data.rtcMessage;

      console.log("answer call is", data);
      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("callAnswered", {
          callee: socket.user,
          from: data.to,
          to: data.from,
          rtcMessage: rtcMessage,
        });
    });

    socket.on("declineCall", async (data) => {
      // console.log("Decline Call", data);
      // // let caller = data.caller;
      // rtcMessage = data.rtcMessage;
      console.log("call is declined", await NSPH_DB.Users.findById(data.to || data.receiver));

      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("callDeclined", {
          // callee: socket.user,
          from: data.to,
          to: data.from,
          // rtcMessage: rtcMessage,
        });
    });

    socket.on("ICEcandidate", async (data) => {
      let otherUser = data.user;
      let rtcMessage = data.rtcMessage;

      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("ICEcandidate", {
          sender: socket.user,
          from: data.from,
          to: data.to,
          rtcMessage: rtcMessage,
        });
    });



    socket.on("messageSeen", async (data) => {
      console.log("message seen", data);
      await NSPH_DB.Messages.updateOne({ _id: data.id }, { seen: Date.now() });
    });

    // socket disconnect


    socket.on("disconnect", () => {
      socket.emit("user-disconnected", socket.id);
    });
  });
};

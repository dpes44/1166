const jwt = require("jsonwebtoken");
const socket = require("socket.io");
const sendNotification = require("./helper/notification.helper");
const { getUserFromToken } = require("./helper/token");
const { checkTokenMiddleware } = require("./middleware/socket");
const livekitApi = require("livekit-server-sdk");
const AccessToken = livekitApi.AccessToken;
const RoomServiceClient = livekitApi.RoomServiceClient;
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
    console.log("connected");
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

      // emit message to  user
      let newMsg = message.toObject();
      newMsg["senderDetail"] = await NSPH_DB.Users.findById(
        data.from || data.sender,
        "username status firstname lastname email"
      );
      // sendNotification(data.to || data.receiver, newMsg);
      io.to(await NSPH_DB.Users.getSocketId(data.to || data.receiver)).emit(
        "receive-msg",
        newMsg
      );
      // find or create chat list
      await NSPH_DB.ChatList.createOrUpdate(
        data.from || data.sender,
        data.to || data.receiver,
        message._id
      );
    });

    socket.on("call", async (data) => {
      console.log("data is ", data);
      const roomName =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const initiatorName = "user-name" + Math.floor(Math.random() * 1000);
      const receiverName = "user-name" + Math.floor(Math.random() * 1000);

      let initiatorToken = new AccessToken(
        process.env.LIVEKIT_DEVKEY || "devkey",
        process.env.LIVEKIT_SECRETKEY || "secret",
        {
          identity: initiatorName,
        }
      );

      let receiverToken = new AccessToken(
        process.env.LIVEKIT_DEVKEY || "devkey",
        process.env.LIVEKIT_SECRETKEY || "secret",
        {
          identity: receiverName,
        }
      );
      initiatorToken.addGrant({ roomJoin: true, room: roomName });
      receiverToken.addGrant({ roomJoin: true, room: roomName });
      initiatorToken = initiatorToken.toJwt();
      console.log("initiator token is ", initiatorToken);
      receiverToken = receiverToken.toJwt();

      // call detail
      let rtcMessage = data.rtcMessage;
      let callDetail = {
        from: data.from,
        to: data.to,
        caller: socket.user,
        rtcMessage: rtcMessage,
      };

      callDetail["senderDetail"] = await NSPH_DB.Users.findById(
        data.from || data.sender,
        "username status firstname lastname middlename gender email"
      );

      const message = new NSPH_DB.Messages({
        sender: data.from || data.sender,
        receiver: data.to || data.receiver,
        type: "call",
        body: receiverToken,
      });

      await message.save();
      socket.emit("initCallToken", {
        ...callDetail,
        token: initiatorToken,
      });

      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("newCall", {
          ...callDetail,
          token: receiverToken,
        });
    });

    socket.on("answerCall", async (data) => {
      console.log("Answer Call", data);
      // let caller = data.caller;
      rtcMessage = data.rtcMessage;
      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("callAnswered", {
          callee: socket.user,
          from: data.to,
          to: data.from,
          rtcMessage: rtcMessage,
        });
    });

    socket.on("busy", async (data) => {
      socket
        .to(await NSPH_DB.Users.getSocketId(data.to || data.receiver))
        .emit("busy", {
          from: data.to,
          to: data.from,
          // rtcMessage: rtcMessage,
        });
    });

    socket.on("declineCall", async (data) => {
      console.log(
        "call is declined",
        await NSPH_DB.Users.findById(data.to || data.receiver)
      );

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
      await NSPH_DB.Messages.updateOne(
        { _id: data.id || data._id },
        { seen: Date.now() }
      );
    });

    // socket disconnect
    socket.on("disconnect", async () => {
      // socket.emit("user-disconnected", socket.id);
      socket && socket.user ? (socket.user.onlineStatus = "Offline") : null;
      socket && socket.user ? await socket.user.save() : null;
    });
  });
};

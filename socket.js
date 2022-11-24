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
      const chatList = await NSPH_DB.ChatList.findOrCreate(
        data.from || data.sender,
        data.to || data.receiver
      );
    });

    socket.on("call-user", async (data) => {
      console.log("call user event is ", data.to);
      io.to(await NSPH_DB.Users.getSocketId(data.to || data.receiver)).emit(
        "call-receive",
        { signal: data.signalData, from: data.from, to: data.to }
      );
    });
    socket.on("call-answer", async (data) => {
      console.log("call accepted message", data.to);
      io.to(await NSPH_DB.Users.getSocketId(data.to || data.receiver)).emit(
        "call-accepted",
        data.signal
      );
    });

    socket.on("call-decline", async (data) => {
      io.to(await NSPH_DB.Users.getSocketId(data.to || data.receiver)).emit(
        "call-declined",
        data
      );
    });

    socket.on("disconnect", () => {
      socket.emit("user-disconnected", socket.id);
    });
  });
};

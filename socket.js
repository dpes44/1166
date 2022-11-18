const jwt = require("jsonwebtoken");
const socket = require("socket.io");
module.exports = function (server) {
  const io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.headers["x-access-token"];
    try {
      if (!token) throw new Error("Token is required");
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_KEY || "jkhdfjasdhf987dfa984r32fas2"
      );

      const user = await NSPH_DB.Users.findOne(
        {
          $or: [
            { email: decoded.email },
            { username: decoded.username },
            { _id: decoded._id },
          ],
        },
        {
          username: 1,
          email: 1,
          _id: 1,
          socketId: 1,
          firstname: 1,
          lastname: 1,
          middlename: 1,
        }
      );

      if (!user) {
        throw { msg: "Invalid User" };
      }
      user.socketId = socket.id;

      const newUser = await user.save();
      console.log("new user is ", newUser);
        socket.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(new Error(error.msg || "Invalid User"));
    }
  });

  io.on("connection", async (socket) => {
    // updated user with new socket id

    socket.on("send-msg", async (data) => {
      NSPH_DB.Messages.create({
        sender: data.from || data.sender,
        receiver: data.to || data.receiver,
        body: data.message || data.body,
      });
      const user = await NSPH_DB.Users.findOne(
        {
          _id: data.to || data.receiver,
        },
        { username: 1, socketId: 1, email:1 }
      );

      NSPH_DB.ChatList.findOne({
        $or: [
          { userOne: data.from || data.sender, userTwo: data.to || data.receiver },
          { userOne: data.to || data.sender, userTwo: data.from || data.receiver},
        ],
      })
        .then((chat) => {
          if (chat) {
            return null;
          }
          NSPH_DB.ChatList.create({
            userOne: data.from || data.sender,
            userTwo: data.to || data.receiver,
          });
          io.to(user.socketId).emit("new-roster", socket.user);
        })
        .catch((err) => {});

      io.to(user.socketId).emit("receive-msg", {
        body: data.message || data.body,
        from: data.from || data.sender,
        to: data.to || data.receiver,
      });
    });

    socket.on("disconnect", () => {
      socket.emit("user-disconnected", socket.id);
    });
  });
};

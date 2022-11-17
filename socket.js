const socket = require("socket.io")
module.exports = function (server) {



    const io = socket(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.headers['x-access-token'];
        console.log(token);
        // verify user 
        if (true) {
            next();
        } else {
            next(new Error("invalid"));
        }
    });

    io.on("connection", data => {
        console.log("User connected with", data.id);

        // updated user with new socket id 
        io.on('message', (data) => {
            io.emit('send_msg', { message: 'Hello from client' });
          });
        data.on("disconnect", () => {
            console.log("User disconnected");
        });
    })
}
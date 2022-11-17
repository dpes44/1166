const socket = require("socket.io")
module.exports = function (server) {
    const io = socket(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", data => {
        console.log("User connected with id", data.id);
        data.on("disconnect", () => {
            console.log("User disconnected");
        });
    })
}
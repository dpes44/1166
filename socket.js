const socket = require("socket.io")
module.exports = function (server) {
    const io = socket(server);

    io.on("connection", data => {
        console.log("User connected");
        data.on("disconnect", () => {
            console.log("User disconnected");
        });
    })
}
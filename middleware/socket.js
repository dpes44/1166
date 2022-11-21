const { getUserFromToken } = require("../helper/token");

const checkTokenMiddleware = async (socket, next) => {
    const token = socket.handshake.headers["x-access-token"];
    try {
        const user = await getUserFromToken(token);
        socket.user = user;
        next();
    } catch (error) {
        console.log(error);
        next(new Error(error.msg || "Invalid User from middleware"));
    }
}

module.exports = { checkTokenMiddleware, };

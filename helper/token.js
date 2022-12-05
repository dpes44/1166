const jwt = require("jsonwebtoken");

const getUserFromToken = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token) throw new Error("Token is required");
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_KEY || "jkhdfjasdhf987dfa984r32fas2"
      );
      // check if expire
      // if (decoded.exp < Date.now()) {
      //     reject("Token Expired");
      // }
      console.log("decoded user is", decoded);
      const user = await NSPH_DB.Users.findOne({ username: decoded.username });
      if (!user) {
        reject("Invalid User");
      }
      resolve(user);
    } catch (error) {
      console.log(error);
      reject(error.toString());
    }
  });
};

module.exports = {
  getUserFromToken,
};

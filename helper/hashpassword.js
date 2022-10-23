const bcrypt = require("bcrypt");

module.exports = function (password) {
  const saltRounds = 7;
  const salt = bcrypt.genSaltSync(saltRounds);
  let hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};
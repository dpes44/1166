const Mongoose = require("mongoose");

module.exports = {
    validateMongooseId: (arr) => {
        return arr.filter((id) => Mongoose.Types.ObjectId.isValid(id));
    }
}
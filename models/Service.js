const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const ServiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
    },
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = Service = mongoose.model("service", ServiceSchema);

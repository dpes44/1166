// models/User.js

const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, "Subtitle is required"],
      trim: true,
    },
    cardBody: {
      type: String,
      required: [true, "Card Body is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      trim: true,
    },
    pictures: [{ name: String, url: String }],
    thumbnail: {
      name: String,
      url: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    slug: { type: String, slug: ["title", "subtitle"] },
  },
  {
    timestamps: true,
  }
);

module.exports = Blog = mongoose.model("blog", BlogSchema);

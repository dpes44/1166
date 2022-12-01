const { returnResponse } = require("../../helper/response.helper");
const upload = require("../../middleware/uploader");
const fs = require("fs");
const path = require("path");
const router = require("express").Router();

router.get("/list", async function (req, res, next) {
  try {
    const blogs = await NSPH_DB.Blog.find();
    return returnResponse(res, blogs);
  } catch (err) {
    next(err);
  }
});

router
  .route("/add")
  .post(upload.single("thumbnail"), async function (req, res) {
    try {
      if (req.file) {
        req.body.thumbnail = {
          name: req.file.filename,
          url: `/upload/${req.file.filename}`,
        };
      }
      const blog = await NSPH_DB.Blog.create(req.body);
      return returnResponse(res, blog);
    } catch (err) {
      console.log("error is ", err);
      return next(err);
    }
  });

router
  .route("/update/:id")
  .put(upload.single("thumbnail"), async function (req, res, next) {
    try {
      if (req.file) {
        req.body.thumbnail = {
          name: req.file.filename,
          url: `/upload/${req.file.filename}`,
        };
      }

      const oldBlog = await NSPH_DB.Blog.findById(req.params.id);
      if (!oldBlog) {
        throw { message: "Blog not found", status: 404 };
      }
      if (oldBlog.thumbnail.name) {
        fs.unlink(
          path.join(process.cwd(), `/public/upload/${oldBlog.thumbnail.name}`),
          function (err, done) {
            if (err) {
              console.log("error deleting file", err);
            }
            console.log("file deleted");
          }
        );
      }
      const blog = await NSPH_DB.Blog.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      return returnResponse(res, blog);
    } catch (err) {
      console.log("error is", err);
      next(err);
    }
  });

router.get("/:id", async function (req, res, next) {
  try {
    const blog = await NSPH_DB.Blog.findById(req.params.id);
    if (!blog) {
      throw { message: "Blog not found", status: 404 };
    }
    return returnResponse(res, blog);
  } catch (err) {
    next(err);
  }
});
module.exports = router;

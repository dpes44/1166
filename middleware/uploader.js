const multer = require("multer");
//node native module = path
const path = require("path");

function fileFilter(req, file, cb) {
  const imgType = file.mimetype.split("/")[0];
  if (imgType !== "image") {
    req.fileTypeErr = true;
    cb(null, false);
  } else {
    req.fileTypeErr = false;
    cb(null, true);
  }
}

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/public/uploads"));
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" +file.originalname);
  },
});

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
});
module.exports = upload;

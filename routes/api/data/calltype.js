const express = require("express");
const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const callTypeList = await NSPH_DB.CallType.find();
    res.json(callTypeList);
  } catch (err) {
    console.log("Error is ", err);
    return next(err);
  }
});

router.get("/:id", async (req, res,  next) => {
  try {
    const callType = await NSPH_DB.CallType.findById(req.params.id);
    if (!callType) {
      throw {
        status: 404,
        msg: "Call Type not found.",
      };
    }
    res.json(callType);
  } catch (err) {
    return next(err);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const newCallType = await NSPH_DB.CallType.create(req.body);
    res.json(newCallType);
  } catch (err) {
    console.log("error", err);
    next(err);
  }
});

// @route GET api/books/:id
// @description Update book
// @access Public
router.put("/:id", async (req, res, next) => {
  try {
    const updatedCallType = await NSPH_DB.CallType.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json(updatedCallType);
  } catch (err) {
    next(err);
  }
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    const callType = await NSPH_DB.CallType.findById(req.params.id);
    if (!callType) {
      throw {
        status: 404,
        msg: "Call Type not found.",
      };
    }

    const removedCallType = await callType.remove();
    res.json(removedCallType);
  } catch (err) {
    console.log("err is ", err);
    next(err);
  }
});
module.exports = router;

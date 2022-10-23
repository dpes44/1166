const express = require("express");
const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const shiftList = await NSPH_DB.Shift.find();
    res.json(shiftList);
  } catch (err) {
    console.log("Error is ", err);
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const shift = await NSPH_DB.Shift.findById(req.params.id);
    if (!shift) {
      throw {
        status: 404,
        msg: "Shift not found.",
      };
    }
    res.json(shift);
  } catch (err) {
    console.log("Error is", err);
    return next(err);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const newShift = await NSPH_DB.Shift.create(req.body);
    res.json(newShift);
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
    const updatedShift = await NSPH_DB.Shift.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json(updatedShift);
  } catch (err) {
    next(err);
  }
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete("/:id", async (req, res, next) => {
  try {
    const shift = await NSPH_DB.Shift.findById(req.params.id);
    if (!shift) {
      throw {
        status: 404,
        msg: "Shift not found.",
      };
    }

    const removedShift = await shift.remove();
    res.json(removedShift);
  } catch (err) {
    console.log("err is ", err);
    next(err);
  }
});
module.exports = router;

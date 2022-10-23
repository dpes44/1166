const express = require("express");
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const ageGroupList = await NSPH_DB.AgeGroup.find();
    res.json(ageGroupList);
  } catch (err) {
    console.log("Error is ", err);
    return next(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ageGroup = await NSPH_DB.AgeGroup.findById(req.params.id);
    if (!ageGroup) {
      throw {
        status: 404,
        msg: "Age Group not found.",
      };
    }
    res.json(ageGroup);
  } catch (err) {
    return next(err);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const newAgeGroup = await NSPH_DB.AgeGroup.create(req.body);
    res.json(newAgeGroup);
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
    const updatedAgeGroup = await NSPH_DB.AgeGroup.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    console.log("updated user", updatedAgeGroup)
    res.json(updatedAgeGroup);
  } catch (err) {
    next(err);
  }
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    const ageGroup = await NSPH_DB.AgeGroup.findById(req.params.id);
    if (!ageGroup) {
      throw {
        status: 404,
        msg: "Age Group not found.",
      };
    }

    const removedAgeGroup = await ageGroup.remove();
    res.json(removedAgeGroup);
  } catch (err) {
    console.log("err is ", err);
    next(err);
  }
});
module.exports = router;

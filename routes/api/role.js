const router = require("express").Router();
router.post("/add", async function (req, res, next) {
  try {
    const role = await NSPH_DB.Role.create({
      name: req.body.name,
      permission:req.body.permission
    });

    res.json(role);
  } catch (err) {
    next(err);
  }
});

router.get("/list", async function (req, res, next) {
  try {
    const roles = await NSPH_DB.Role.find();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const updatedRole = await NSPH_DB.Role.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedRole) {
    }
    res.json(updatedRole);
  } catch (err) {
    console.log("err");
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const role = await NSPH_DB.Role.findById(
      req.params.id
    );
    if (!role) {
      throw {
        status: 404,
        msg:"Role not found."
      }
    }
    res.json(role);
  } catch (err) {
    console.log("err");
    next(err);
  }
});

module.exports = router;

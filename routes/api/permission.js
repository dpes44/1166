const router = require("express").Router();

router.post("/add", async function (req, res, next) {
  try {
    const permission = await NSPH_DB.Permission.create({
      name: req.body.name,
    });

    res.json(permission);
  } catch (err) {
    next(err);
  }
});

router.get("/list", async function (req, res, next) {
  try {
    const permissions = await NSPH_DB.Permission.find();
    console.log("searched,", permissions)
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  } 
});

router.put("/:id", async function (req, res, next) {
  try {
    const updatedPermission = await NSPH_DB.Permission.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedPermission) {
    }
    res.json(updatedPermission);
  } catch (err) {
    console.log("err");
    next(err);
  }
});


router.get("/:id", async function (req, res, next) {
  try {
    const permission = await NSPH_DB.Permission.findById(
      req.params.id
    );
    if (!permission) {
      throw {
        status: 404,
        msg:"Permission not found."
      }
    }
    res.json(permission);
  } catch (err) {
    console.log("err");
    next(err);
  }
});
module.exports = router;

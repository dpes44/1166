// routes/api/books.js
const sudo = require("sudo-js");
const { exec } = require("child_process");
const express = require("express");
const router = express.Router();
const hash = require("../../helper/hashpassword");

// Load User model
const User = require("../../models/Users");
const { returnResponse } = require("../../helper/response.helper");

// @route GET api/User/test
// @description tests User route
// @access Public
router.get("/user", (req, res) => {
  const email = req.session.user.email;

  if (email) {
    User.findOne({ email })
      .then((user) => res.json(user))
      .catch((err) => res.status(404).json({ nouserfound: "No users found" }));
  } else {
    return res.status(400).json({ msg: "Please Login" });
  }
});

router.get("/facilitators", async (req, res, next) => {
  try {
    // NSPH_DB.Users.find({
    //   roles: { name: { $in: ["Facilitator"] } },
    // })
    //   .populate("roles", "name")
    //   .exec(function (err, facilitators) {
    //     if (err) {
    //       console.log("error is thr", err);
    //       throw err;
    //     }
    //     console.log("Faciliators ", facilitators);
    //     return returnResponse(res, facilitators);
    //   });

    const result = await NSPH_DB.Users.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "roles",
          foreignField: "_id",
          as: "roles",
        },
      },
      { $unwind: { path: "$roles" } },
      { $match: { "roles.name": "Facilitator" } },
    ]);

    return returnResponse(res, result);
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});
// @route GET api/User
// @description Get all User
// @access Public
router.get("/", (req, res) => {
  if (req && req.session && req.session.user && req.session.user.email) {
    const email = req.session.user.email;
    User.findOne({ email })
      .then((user) => res.json(user))
      .catch((err) => res.status(404).json({ nouserfound: "No users found" }));
  } else {
    return res.status(400).json({ msg: "Please Login" });
  }
});

// get all users in the database
router.get("/list", async (req, res, next) => {
  try {
    const users = await NSPH_DB.Users.find(
      {
        email: { $nin: [req.user.email] },
        // roles: { $nin: ["6326d8833be0d13048de6b16"] },
      },
      {
        username: 1,
        email: 1,
        name: 1,
        roles: 1,
        createdAt: 1,
      }
    ).populate("roles").sort({ createdAt: -1 });

    return returnResponse(res, users);
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

router.get("/roster/:userId", async (req, res, next) => {
  try {
    const datas = await NSPH_DB.ChatList.find({
      $or: [{ userOne: req.params.userId }, { userTwo: req.user._id }],
    }).populate("userOne", "username email _id").populate("userTwo", "username email _id").sort({ createdAt: 1 });

    const rosters = datas.map(function (user) {
      return user.userOne._id == req.params.userId ? user.userTwo : user.userOne;
    })
    return returnResponse(res, rosters);
  } catch (err) {
    next(err);
  }
});

// @route GET api/books/:id
// @description Get single book by id
// @access Public
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .populate([
      {
        path: "roles",
        select: "name",
      },
    ])
    .then((user) => res.json(user))
    .catch((err) => res.status(404).json({ nouserfound: "No User found" }));
});

// @route GET api/books
// @description add/save book
// @access Public
router.post("/create", async (req, res, next) => {
  try {
    // const role = await NSPH_DB.Role.findById(req.body.role);
    // if(!role) {
    //   throw {status: 404, msg:"This role is not available"}
    // }
    const hashedPassword = hash(req.body.password);
    const oldUser = await NSPH_DB.Users.findOne({
      $or: [{ username: req.body.username }],
    });
    if (oldUser) {
      throw { status: 422, msg: "Email already registered" };
    }
    let roles = [];
    if (Array.isArray(req.body.role)) {
      roles = req.body.role.map((id) => id);
    } else {
      roles.push(req.body.role);
    }
    // res.status(200).json({});
    // return;
    const user = await NSPH_DB.Users.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      middlename: req.body.middlename,
      email: req.body.email,
      roles: roles,
      password: hashedPassword,
    });

    var comm =
      "sudo /usr/bin/prosodyctl register " +
      req.body.username +
      "@chat2.leanq.com.np 1166";

    sudo.setPassword("1166");

    var command = [
      "sudo",
      "/usr/bin/prosodyctl",
      "register",
      `${req.body.username}@chat2.leanq.com.np`,
      "1166",
    ];

    sudo.exec(command, (error, pid, result) => {
      if (error) {
        console.log("error:", error.message);
      }
      if (pid) {
        console.log("pid:", pid);
      }
      console.log("stdout:", result);
    });
    res.status(200).json(user);
    // res.status(200).json([]);
  } catch (err) {
    console.log("error is ", err);
    next(err);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    // const role = await NSPH_DB.Role.findById(req.body.role);
    // if(!role) {
    //   throw {status: 404, msg:"This role is not available"}
    // }
    // const hashedPassword = hash(req.body.password);
    const oldUser = await NSPH_DB.Users.findOne({
      username: req.body.username,
    });
    res.status(200).json(user);
    // res.status(200).json([]);
  } catch (err) {
    console.log("error is ", err);
    next(err);
  }
});

// @route GET api/books/:id
// @description Update book
// @access Public
router.put("/:id", async (req, res, next) => {
  try {
    const user = await NSPH_DB.User.findById(req.params.id);
    if (!user) {
      throw { status: 404, msg: "User not found" };
    }

    if (req.body.firstname && req.body.lastname) {
      user.name = req.body.firstname + " " + req.body.lastname;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword) {
        throw {
          status: 402,
          msg: "Password and confirm password should be same.",
        };
      }
      let hashedPassword = hash(req.body.password);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete("/:id", (req, res) => {
  console.log("user deleted", req.params.id);
  User.findByIdAndRemove(req.params.id, req.body)
    .then((book) => res.json({ mgs: "User entry deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "No such a user" }));
});
module.exports = router;

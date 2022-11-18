// routes/api/books.js

const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const validator = require("validator");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { exec } = require("child_process");
const MAX_AGE = 10;

// Load User model
const User = require("../../models/Users");

const jwt = require("jsonwebtoken");

const authMiddleware = require("../../middleware/auth");
const { returnResponse } = require("../../helper/response.helper");

// @route GET api/User/test
// @description tests User route
// @access Public
authRouter.get("/user", async (req, res) => res.send("user route testing!"));
//bitbucket pass: ATBBtyULk2pNef4yuVu3wxuN8Qck344558D1

authRouter.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  var otp = Math.floor(1000 + Math.random() * 9000);

  user.otp = otp;
  await user.save();

  // send email
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const transporter = nodemailer.createTransport({
    host: "mail.manosamajik.com.np",
    port: 587,
    auth: {
      user: "test@manosamajik.com.np",
      pass: "ABCdef123@@",
    },
  });
  await transporter.sendMail({
    from: "office@leanq.digital",
    to: email,
    subject: "1166 Nation Sucides Prevention Helpline",
    html:
      "<h1>Please enter this " +
      otp +
      " OTP to reset your password. <br />Regards,<br />1166 NSPH Team</h1>",
  });
  return res.status(200).json({ msg: "Email sent with OTP" });
});
// @route GET api/User
// @description Get all User
// @access Public
authRouter.post("/register", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and Password is required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password should be atleast 8 characters long" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Please enter valid email address" });
  }
  if (password != confirm_password) {
    return res.status(400).json({ msg: "Password does not match" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const newUser = new User({ name, email, password });
  bcrypt.hash(password, 7, async (err, hash) => {
    if (err) {
      return res.status(400).json({ msg: "Error saving the password" });
    } 
    newUser.password = hash;
    const isUserSaved = await newUser.save();

    if (isUserSaved) {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

      const transporter = nodemailer.createTransport({
        host: "mail.manosamajik.com.np",
        port: 587,
        auth: {
          user: "test@manosamajik.com.np",
          pass: "ABCdef123@@",
        },
      });

      // send email
      await transporter.sendMail({
        from: "office@leanq.digital",
        to: email,
        subject: "1166 Nation Sucides Prevention Helpline",
        html:
          "<h1>Dear " +
          name +
          ",<br />Welcome to 1166 Nation Sucides Prevention Helpline<br />Regards,<br />1166 NSPH Team</h1>",
      });
      var comm =
        "sudo /usr/bin/prosodyctl register " +
        email.substring(0, email.indexOf("@")) +
        " chat.leanq.com.np " +
        password;

      exec(comm, (error, stdout, stderr) => {
        if (error) {
          console.log("error:", error.message);
          //return;
        }
        if (stderr) {
          console.log("stderr:", stderr);
          //return;
        }
        console.log("stdout:", stdout);
      });

      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.TOKEN_KEY || "jkhdfjasdhf987dfa984r32fas2",
        {
          expiresIn: "2000h",
        }
      );

      // save user token
      const tokenData = {
        email: email,
        name: name,
        token: token,
        msg: "User registered sucessfully",
      };
      //user.token = token;
      const userSaved = await newUser.save();
      return res.status(200).json(tokenData);

      //return res.status(200).json({ msg: "User registered sucessfully"})
    } else {
      return res
        .status(400)
        .json({ msg: "Unexpected error occured, please try again" });
    }
  });
});

// @route GET api/auth/facebookLogin
// @description Post
// @access Public
authRouter.post("/facebookLogin", async (req, res) => {
  const { name, email, facebookId, facebookAccessToken, photo } = req.body;

  const oldUser = await User.findOne({ email });
  const data = {};
  data.isUserSaved = false;

  if (oldUser) {
    data.oldUser = "1";
    oldUser.facebookId = facebookId;
    oldUser.facebookAccessToken = facebookAccessToken;
    oldUser.photo = photo;

    await oldUser.save();
    data.isUserSaved = true;
  } else {
    const newUser = new User({
      name,
      email,
      facebookId,
      facebookAccessToken,
      photo,
    });
    data.isUserSaved = await newUser.save();
  }

  if (data.isUserSaved) {
    data.msg = "Logged in";
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    const transporter = nodemailer.createTransport({
      host: "mail.manosamajik.com.np",
      port: 587,
      auth: {
        user: "test@manosamajik.com.np",
        pass: "ABCdef123@@",
      },
    });

    if (data.oldUser) {
      //do nothing
    } else {
      // send email
      await transporter.sendMail({
        from: "office@leanq.digital",
        to: email,
        subject: "1166 Nation Sucides Prevention Helpline",
        html:
          "<h1>Dear " +
          name +
          ",<br />Welcome to 1166 Nation Sucides Prevention Helpline<br />Regards,<br />1166 NSPH Team</h1>",
      });
    }
    return res.status(200).json(data);
  } else {
    return res
      .status(400)
      .json({ msg: "Unexpected error occured, please try again" });
  }
});
// @route GET api
// @description
// @access Public
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //server side validation
  if (!email) {
    return res.status(400).json({ msg: "Please enter your email" });
  }

  if (!password) {
    return res.status(400).json({ msg: "Please enter your password" });
  }

  const user = await User.findOne({ email }).populate([
    {
      path: "permission",
      model: "permission",
      select: "name",
    },
    {
      path: "roles",
      select: "name permission",
      populate: { path: "permission", model: "permission", select: "name" },
    },
  ]);
  // const user = await User.findOne({email}).populate("permissions")

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  //compare password
  const mathPassword = await bcrypt.compare(password, user.password);

  if (mathPassword) {
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY || "jkhdfjasdhf987dfa984r32fas2",
      {
        expiresIn: "2000h",
      }
    );

    // save user token
    // const tokenData = {email: email, password:password, token:token}
    //user.token = token;
    const userSaved = await user.save();
    return res.status(200).json({
      user: {
        name: user.name,
        username: user.username,
        _id: user._id,
        status: user.status,
        roles: user.roles,
        email: user.email,
        permission: user.permission,
      },
      token: token,
    });
  } else {
    //if wrong password, send the error
    return res.status(400).json({ msg: "Invalid password" });
  }
});

authRouter.post("/editProfile", authMiddleware, async (req, res) => {
  const email = req.session.user.email;
  const { name, password } = req.body;
  //server side validation
  if (!email) {
    return res.status(400).json({ msg: "Please enter your email" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  if (!password) {
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err) {
        return res.status(400).json({ msg: "Error saving the password" });
      }
      user.password = hash;
      user.name = name;
      const isUserSaved = await user.save();

      if (isUserSaved) {
        return res.status(200).json({ msg: "User updated sucessfully" });
      } else {
        return res
          .status(400)
          .json({ msg: "Unexpected error occured, please try again" });
      }
    });
  } else {
    user.name = name;
    const isUserSaved = await user.save();
  }
});

authRouter.post("/guest/register", async (req, res, next) => {
  try {
    const { username } = req.body;
    const oldUser = await NSPH_DB.Users.findOne({
      username: username,
    })
    
    // .populate([
    //   {
    //     path: "permission",
    //     model: "permission",
    //     select: "name",
    //   },
    //   {
    //     path: "roles",
    //     select: "name permission",
    //     populate: { path: "permission", model: "permission", select: "name" },
    //   },
    // ]);

    if (oldUser) {
      throw {
        status: 400,
        msg: "User already exists.",
      };
      // const token = jwt.sign(
      //   { username: username },
      //   process.env.TOKEN_KEY || "jkhdfjasdhf987dfa984r32fas2",
      //   {
      //     expiresIn: "2000h",
      //   }
      // );

      // res.json({
      //   user: oldUser,
      //   token: token,
      // });
    }
    const newUser = await NSPH_DB.Users.create({
      username: username,
      roles: ["63527da890113e06ec9965b3"],
    });

    const user = await NSPH_DB.Users.findById(newUser._id).populate([
      {
        path: "permission",
        model: "permission",
        select: "name",
      },
      {
        path: "roles",
        select: "name permission",
        populate: { path: "permission", model: "permission", select: "name" },
      },
    ]);
    const token = jwt.sign(
      { username: username },
      process.env.TOKEN_KEY || "jkhdfjasdhf987dfa984r32fas2",
      {
        expiresIn: "2000h",
      }
    );

   return  returnResponse(res, {user: user, token: token});
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

module.exports = authRouter;

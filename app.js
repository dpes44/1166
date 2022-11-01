const express = require("express");
const connectDB = require("./config/db");

const app = express();
const cors = require("cors");
// const session = require('express-session')
//const MongoDBStore = require('connect-mongodb-session')(session)
const models = require("./models");
const dotenv = require("dotenv");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./api.yaml");

dotenv.config();
global.NSPH_DB = models;
const authMiddleware = require("./middleware/auth");

var fs = require("fs");

// swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
// --legacy-peer-deps
// This line is from the Node.js HTTPS documentation.
// var options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/nsph.leanq.com.np/fullchain.pem', 'utf8'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/nsph.leanq.com.np/privkey.pem', 'utf8'),
//   ca: fs.readFileSync('/etc/letsencrypt/live/nsph.leanq.com.np/chain.pem', 'utf8')
// };
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// sudo prosodyctl register raj3 chat.leanq.com.np 123456
//bitbucket paasword: ATBB7eZABC3Tq6L9eDXqscuBALCvBF18AB74
// var userRouter = express.Router();

// Connect Database
connectDB();

app.get('*', function (req, res, next) {
  if (req.url.indexOf('/api') === 0) next();
  else res.sendFile(__dirname + '/public/index.html');
});


app.get("/", (req, res) => res.send("Hello world!"));

//setting up cors
app.use(cors("*"));
//API Start
app.use("/api/user", authMiddleware, require("./routes/api/users"));
app.use("/api/role", authMiddleware, require("./routes/api/role"));
app.use(
  "/api/age-group",
  authMiddleware,
  require("./routes/api/data/agegroup")
);
app.use(
  "/api/call-type",
  authMiddleware,
  require("./routes/api/data/calltype")
);
app.use("/api/shift", authMiddleware, require("./routes/api/data/shift"));

app.use("/api/permission", require("./routes/api/permission"));
app.use("/api/auth", require("./routes/api/auth"));
//API End

const port = process.env.PORT || 8082;

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

//error handler middleware
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const errMsg = err.errMsg || err;
  res.status(status).json({ errMsg });
});

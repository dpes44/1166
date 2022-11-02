// routes/api/books.js

const express = require("express");
const xmppRouter = express.Router();

// Load User model
const User = require("../../models/Users");

const xmpp = require("simple-xmpp");

// this function recursively call itself by sending the provided message every 5 seconds.
function send() {
  setTimeout(send, 5000);
  xmpp.send("myself @localhost", `hi! Today is ${new Date().toLocaleString()}`);
}

//if online, that is connected to the server the send function will be excuted and log to console
xmpp.on("online", (data) => {
  console.log("hello, you are live!");
  console.log(`Connected as ${data.jid.user}`);
  send();
});

// if chat was received from other client, the log will be executed
xmpp.on("chat", (from, message) => {
  console.log(`Got a message! ${message} from ${from}`);
});

xmpp.on("chatstate", function (from, state) {
  console.log("% is currently %s", from, state);
});

xmpp.on("buddy", function (jid, state, statusText, resource) {
  console.log("%s is in %s state - %s -%s", jid, state, statusText, resource);
});

xmpp.on("buddyCapabilities", function (jid, data) {
  // data contains clientName and features
  console.log(data.features);
});

// connect method requires object with paramters below
xmpp.connect({
  jid: "rajendra11@chat.leanq.com.np",
  password: "12345678",
  host: "chat.leanq.com.np",
  port: 5222,
});
module.exports = xmppRouter;

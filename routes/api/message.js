const { returnResponse } = require("../../helper/response.helper");

const router = require("express").Router();

router.get("/chat-list", async function (req, res, next) {
  try {
    // console.log("req.user._id", req.user)
    const chatLists = await NSPH_DB.ChatList.getChatList(req.user._id);
    console.log("from list", chatLists);
    return returnResponse(res, chatLists);
  } catch (error) {
    console.log("error is", error);
    return next(error);
  }
});

router.post("/send", async function (req, res, next) {
  try {
    const data = req.body;
    const message = await NSPH_DB.Messages.create({
      sender: data.from || data.sender,
      receiver: data.to || data.receiver,
      body: data.message || data.body,
    });
    console.log("message is", message);
  } catch (err) {
    console.log("error is ", err);
  }
});
router.get("/:userId", async function (req, res, next) {
  try {
    const messages = await NSPH_DB.Messages.find({
      $or: [
        { sender: req.params.userId, receiver: req.user._id },
        { sender: req.user._id, receiver: req.params.userId },
      ],
    }).sort({ createdAt: 1 });
    return returnResponse(res, messages);
  } catch (error) {
    console.log("error is", error);
    return next(error);
  }
});

module.exports = router;

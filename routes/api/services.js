// routes/api/books.js
const express = require("express");
const { returnResponse } = require("../../helper/response.helper");
const router = express.Router();
const livekitApi = require("livekit-server-sdk");
const AccessToken = livekitApi.AccessToken;

async function createDeviceToken(
  user = {
    _id: "63a5500a22c0bb2ddc1d08c3",
  },
  tokenId
) {
  try {
    if (tokenId) {
      const deviceToken = await NSPH_DB.Service.findOne({
        user: user._id,
      });

      if (!deviceToken) {
        //if device token not exist in db
        await NSPH_DB.Service.create({
          token: tokenId,
          user: user._id,
        });
      }

      if (deviceToken) {
        //if device token exist in db
        deviceToken.token = tokenId;
        await deviceToken.save();
      }
    }
  } catch (err) {
    console.log("error in creating token", err);
  }
}

router.post("/device-token/add", async function (req, res, next) {
  try {
    let result = "failed";
    if (req.body.deviceToken) {
      await createDeviceToken(req.user, req.body.deviceToken);
      return returnResponse(res, { result: "success" });
    }
    returnResponse(res, { result });
  } catch (err) {
    console.log("error is", err);
    next(err);
  }
});

module.exports = router;

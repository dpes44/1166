const axios = require("axios");

const sendNotification = async (userId) => {
  try {
    const device = await NSPH_DB.Services.findOne({ user: userId });
    console.log("device ", device);
    const endpoint = "https://fcm.googleapis.com/fcm/send";
    const FcmToken = [
      "dkfEbxIfQp63icORSwatKz:APA91bHp6As6rqtU_b0je_a6OI8Ge9Q1e-lhLU_planzFpUkXi6hh_lstVqggyjn_-uL7z48V25vAwiRxm3niAmWTrqAdDoxSXYcHf0aoXs5DsTlXFuCd5SqyRj4Vogs1vWL3dk1p1i0",
    ];
    const serverKey =
      "AAAATlFe5aw:APA91bGgxMMESl2jidurlH4fwGjATRRPPgrBFhY0gZ97pxEZtoYPwZHLCMGfyQT8igJb-Yq-USNB4LoROqCxkyqPB4mLqF2eOTUYrb1HjVGCiNnCXPkrTZ-IPcv_00Y2DDvxxtTCjKc-";
    const data = {
      registration_ids: device.token ? [device.token] : FcmToken,
      data: "sender object",
      notification: {
        title: "test ",
        body: "test ",
      },
    };

    const header = {
      Authorization: `key=${serverKey}`,
      "Content-Type": "application/json",
    };

    await axios({
      url: endpoint,
      data: data,
      method: "post",
      headers: header,
    });
  } catch (err) {
    console.log("err ", err);
  }
};

module.exports = sendNotification;

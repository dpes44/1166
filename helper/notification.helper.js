const axios = require("axios");

const sendNotification = async (notificationData) => {
  try {
    // const device = await NSPH_DB.Services.findOne({ user: userId });
    // console.log("device ", device);
    const endpoint = "https://fcm.googleapis.com/fcm/send";
    const FcmToken = [
      "dkID4JICRP-6es_xihJJjM:APA91bHdbjKGxixUBJox1IXt_nea1rwc3gY0nSpUWWfi8M3LZP-6XajTq3FGJPz7L7VuNRKlQuj8C-HA4xsERutJda9Ye0KJpPpNzkir6Uew99SSYflijLAYCNw_zklqmukqvniddPvR",
    ];

    const serverKey =
      "AAAATlFe5aw:APA91bGgxMMESl2jidurlH4fwGjATRRPPgrBFhY0gZ97pxEZtoYPwZHLCMGfyQT8igJb-Yq-USNB4LoROqCxkyqPB4mLqF2eOTUYrb1HjVGCiNnCXPkrTZ-IPcv_00Y2DDvxxtTCjKc-";
    const data = {
      registration_ids: FcmToken,
      data: notificationData,
    };

    const header = {
      Authorization: `key=${serverKey}`,
      "Content-Type": "application/json",
    };

    const notificationSend = await axios({
      url: endpoint,
      data: data,
      method: "post",
      headers: header,
    });
    console.log("notificationSend ", notificationSend);
  } catch (err) {
    console.log("err ", err);
  }
};

module.exports = sendNotification;

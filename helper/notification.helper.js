const axios = require("axios");

const sendNotification = async (notificationData, userId) => {
  try {
    const device = await NSPH_DB.Service.findOne({ user: userId });
    // console.log("device ", device);
    const endpoint = "https://fcm.googleapis.com/fcm/send";
    const FcmToken = device && device.token ? [device.token] : [];

    const serverKey =
      "AAAANp_od-k:APA91bEBMcqS2OHVxwHPBmsEH6GNu0Z_qVNBDwlXpyp6z_JhhhpKKo01kCiGpDdUA3OFVUJrT8twDJxX59L4bHv_-Qhz239C1kvxgnGtzgiro8aGk2oDARSEWSjwq4-SW30NIizUL8wc";
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

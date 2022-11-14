const returnResponse = (res,data = {}, message = "Succeed.", status = 200,) => {
  return res.status(status).json({
    message,
    data,
    status
  });
};
 
module.exports = {
  returnResponse,
};

const { StatusCodes } = require("http-status-codes");

const sqlError = (res, err) => {
  console.log(err);
  return res.status(StatusCodes.BAD_REQUEST).end();
};

module.exports = sqlError;

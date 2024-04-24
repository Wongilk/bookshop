const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) return next();
  res.status(StatusCodes.BAD_REQUEST).json(err.array());
};

module.exports = validate;

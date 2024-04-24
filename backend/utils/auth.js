const jwt = require("jsonwebtoken");
require("dotenv").config();

const ensureAuth = (req) => {
  try {
    const receivedJwt = req.headers.authorization;
    if (!receivedJwt) throw new ReferenceError("jwt must be provided");
    const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return decodedJwt;
  } catch (error) {
    return error;
  }
};

module.exports = ensureAuth;

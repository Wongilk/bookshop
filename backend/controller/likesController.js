const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const sqlError = require("../utils/sqlError");
const ensureAuth = require("../utils/auth");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const addLike = (req, res) => {
  const likedBookId = req.params.id;

  const auth = ensureAuth(req);

  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  const sql = `insert into likes (userId,likedBookId) values (?,?)`;
  const values = [auth.id, likedBookId];
  conn.query(sql, values, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.affectedRows) res.status(StatusCodes.OK).end();
    else res.status(StatusCodes.BAD_REQUEST).end();
  });
};

const removeLike = (req, res) => {
  const likedBookId = req.params.id;

  const auth = ensureAuth(req);
  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  const sql = `delete from likes where likedBookId = ? and userId = ?`;
  const values = [likedBookId, auth.id];
  conn.query(sql, values, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.affectedRows) res.status(StatusCodes.OK).end();
    else res.status(StatusCodes.BAD_REQUEST).end();
  });
};

module.exports = { addLike, removeLike };

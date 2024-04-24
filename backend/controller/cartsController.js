const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const sqlError = require("../utils/sqlError");
const ensureAuth = require("../utils/auth");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const addCart = (req, res) => {
  const { bookId, quantity } = req.body;

  const auth = ensureAuth(req);

  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  const sql = `insert into cartItems (bookId, quantity, userId) values (?,?,?);`;
  const values = [bookId, quantity, auth.id];
  conn.query(sql, values, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.affectedRows) res.status(StatusCodes.OK).end();
    else res.status(StatusCodes.BAD_REQUEST).end();
  });
};

const removeCart = (req, res) => {
  const { cartItemId } = req.params;

  const auth = ensureAuth(req);

  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  const sql = `delete from cartItems where id = ?;`;
  conn.query(sql, cartItemId, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.affectedRows) res.status(StatusCodes.OK).end();
    else res.status(StatusCodes.BAD_REQUEST).end();
  });
};

const getCart = (req, res) => {
  const { selected } = req.body;

  const auth = ensureAuth(req);

  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  let sql = `select cartItems.id, bookId, quantity, title,summary, price, img 
    from cartItems 
    left join books 
    on cartItems.bookId = books.id
    where cartItems.userId = ?
    `;

  const values = [auth.id];
  if (selected) {
    sql += ` and cartItems.id in (?)`;
    values.push(selected);
  }

  conn.query(sql, values, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.length) return res.status(StatusCodes.OK).json(results);
    else res.status(StatusCodes.BAD_REQUEST).end();
  });
};

module.exports = { addCart, removeCart, getCart };

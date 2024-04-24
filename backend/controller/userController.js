const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv").config();
const sqlError = require("../utils/sqlError");

const join = (req, res) => {
  const { email, password } = req.body;

  const sql = "select * from users where email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.length) return res.status(StatusCodes.CONFLICT).end();

    const salt = crypto.randomBytes(20).toString("base64");
    const encryptedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 20, "sha512")
      .toString("base64");

    const sql = "insert into users (email,password,salt) values (?,?,?)";
    conn.query(sql, [email, encryptedPassword, salt], (err, results) => {
      if (err) return sqlError(res, err);

      if (results.affectedRows) res.status(StatusCodes.CREATED).json(results);
      else res.status(StatusCodes.BAD_REQUEST).json(results);
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "select * from users where email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) return sqlError(res, err);

    const loginUser = results[0];

    const encryptedPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 20, "sha512")
      .toString("base64");

    if (loginUser && loginUser.password === encryptedPassword) {
      const token = jwt.sign(
        { id: loginUser.id, email: loginUser.email },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "30m",
          issuer: "bookshop dev",
        }
      );
      res.cookie("token", token, { httpOnly: true });
      res.status(StatusCodes.OK).json(loginUser);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;

  const sql = "select * from users where email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) return sqlError(res, err);

    if (!results.length) return res.status(StatusCodes.UNAUTHORIZED).end();

    res.status(StatusCodes.OK).json({ email: results[0].email });
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(20).toString("base64");
  const encryptedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 20, "sha512")
    .toString("base64");

  const sql = "update users set password = ?, salt = ? where email = ?";

  conn.query(sql, [encryptedPassword, salt, email], (err, results) => {
    if (err) return sqlError(res, err);

    if (results.affectedRows) res.status(StatusCodes.OK).end();
    else res.status(StatusCodes.BAD_REQUEST).end();
  });
};

module.exports = { join, login, passwordResetRequest, passwordReset };

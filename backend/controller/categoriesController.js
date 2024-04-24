const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const sqlError = require("../utils/sqlError");

const findAllCategories = (req, res) => {
  const sql = "select * from categories";

  conn.query(sql, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.length) res.status(StatusCodes.OK).json(results);
    else res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = findAllCategories;

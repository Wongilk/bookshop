const conn = require("../mariadb");
const mariadb = require("mysql2/promise");

const { StatusCodes } = require("http-status-codes");
const sqlError = require("../utils/sqlError");
const ensureAuth = require("../utils/auth");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const findAllBooks = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bookshop",
    dateStrings: true,
  });
  const { categoryId, isNew, limit, currentPage } = req.query;
  const response = {};
  const offset = limit * (currentPage - 1);

  let sql =
    "select sql_calc_found_rows *, (select count(*) from likes where likedBookId = books.id) as likes from books";
  let connPhrase = " where";

  if (categoryId) {
    sql += ` where categoryId = ${categoryId}`;
    connPhrase = " and ";
  }

  if (isNew === "true") {
    sql += `${connPhrase} pubDate between date_sub(now(), interval 1 month) and now()`;
  }
  sql += ` limit ${offset} , ${parseInt(limit)}`;

  let [results] = await getBooks(conn, sql);
  response.books = results;

  sql = "select found_rows()";
  [results] = await getTotalCounts(conn);
  const pagination = {};
  pagination.totalBooksCount = results[0]["found_rows()"];
  pagination.currentPage = currentPage;
  response.pagination = pagination;

  res.status(StatusCodes.OK).json(response);
};

const findOneBook = (req, res) => {
  const { bookId } = req.params;

  let sql = `select *, (select count(*) from likes where likedBookId = books.id) as likes`;
  const values = [];
  const auth = ensureAuth(req);
  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();
  else if (!(auth instanceof ReferenceError)) {
    sql += `, (select count(*) from likes where userId = ? and likedBookId = ?) as liked `;
    values.push(auth.id);
  }
  sql += `from books left join categories on books.categoryId = categories.categoryId where books.id = ?`;
  values.push(bookId, bookId);

  conn.query(sql, values, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.length) res.status(StatusCodes.OK).json(...results);
    else res.status(StatusCodes.NOT_FOUND).end();
  });
};

const getBooks = async (conn, sql) => {
  return await conn.query(sql);
};

const getTotalCounts = async (conn) => {
  const sql = "select found_rows()";
  return await conn.query(sql);
};
module.exports = { findAllBooks, findOneBook };

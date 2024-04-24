const mariadb = require("mysql2");

const conn = mariadb.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bookshop",
  dateStrings: true,
});

module.exports = conn;

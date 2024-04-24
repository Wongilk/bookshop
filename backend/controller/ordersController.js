const conn = require("../mariadb");
const mariadb = require("mysql2/promise");

const { StatusCodes } = require("http-status-codes");
const sqlError = require("../utils/sqlError");
const ensureAuth = require("../utils/auth");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const orders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bookshop",
    dateStrings: true,
  });

  const { orderItemsId, delivery, totalQuantity, totalPrice, firstBookTitle } =
    req.body;

  const auth = ensureAuth(req);
  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  let [results] = await insertDeliveries(conn, delivery);
  affectRowsCheck(results, res);
  const deliveryId = results.insertId;

  [results] = await insertOrders(
    conn,
    deliveryId,
    auth.id,
    firstBookTitle,
    totalPrice,
    totalQuantity
  );
  affectRowsCheck(results, res);
  const orderId = results.insertId;

  const [orderItemsInfo] = await selectOrderItemsFromCart(conn, orderItemsId);

  [results] = await insertOrderedBooks(conn, orderId, orderItemsInfo);
  affectRowsCheck(results, res);

  [results] = await deleteCartItems(conn, orderItemsId);
  affectRowsCheck(results, res);

  res.status(StatusCodes.OK).end();
};

const getOrders = (req, res) => {
  const auth = ensureAuth(req);

  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  const sql = `select orders.id as orderId, createdAt as orderDate, address, receiver, contact, bookTitle, totalPrice, totalQuantity 
  from orders left join deliveries on orders.deliveryId = deliveries.id where orders.userId = ?`;

  conn.query(sql, auth.id, (err, results) => {
    if (err) sqlError(res, err);

    if (results.length) res.status(StatusCodes.OK).json(results);
    res.status(StatusCodes.BAD_REQUEST).end();
  });
};

const getOrdersDetail = (req, res) => {
  const { orderId } = req.params;

  const auth = ensureAuth(req);

  if (auth instanceof TokenExpiredError)
    return res.status(StatusCodes.UNAUTHORIZED).end();
  else if (auth instanceof JsonWebTokenError)
    return res.status(StatusCodes.BAD_REQUEST).end();

  const sql = `select bookId, title, author, price, orderedBooks.quantity from orderedBooks 
  left join books
  on orderedBooks.bookId = books.id
  where orderId = ${orderId}
  `;
  conn.query(sql, (err, results) => {
    if (err) return sqlError(res, err);

    if (results.length) res.status(StatusCodes.OK).json(results);
    res.status(StatusCodes.BAD_REQUEST).end();
  });
};

const affectRowsCheck = (results, res) => {
  if (!results.affectedRows) return res.status(StatusCodes.BAD_REQUEST).end();
};

const insertDeliveries = async (conn, delivery) => {
  const sql = `insert into deliveries (address,receiver,contact) values (?,?,?)`;
  const values = [delivery.address, delivery.receiver, delivery.contact];
  return await conn.query(sql, values);
};

const insertOrders = async (
  conn,
  deliveryId,
  userId,
  firstBookTitle,
  totalPrice,
  totalQuantity
) => {
  const sql = `insert into orders (deliveryId, userId, bookTitle,totalPrice,totalQuantity) values (?,?,?,?,?)`;
  const values = [
    deliveryId,
    userId,
    firstBookTitle,
    totalPrice,
    totalQuantity,
  ];
  return await conn.query(sql, values);
};

const selectOrderItemsFromCart = async (conn, orderItemsId) => {
  const sql = `select bookId,quantity from cartItems where id in (?)`;
  return await conn.query(sql, [orderItemsId]);
};

const insertOrderedBooks = async (conn, orderId, orderItemsInfo) => {
  const orderedBooks = [];
  orderItemsInfo.forEach((item) => {
    orderedBooks.push([orderId, item.bookId, item.quantity]);
  });
  const sql = `insert into orderedBooks (orderId,bookId,quantity) values ?`;
  return await conn.query(sql, [orderedBooks]);
};

const deleteCartItems = async (conn, orderItemsId) => {
  const sql = `delete from cartItems where id in (?)`;
  return await conn.query(sql, [orderItemsId]);
};

module.exports = { orders, getOrders, getOrdersDetail };

const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const likesRouter = require("./routes/likes");
const ordersRouter = require("./routes/orders");
const cartsRouter = require("./routes/carts");
const categoriesRouter = require("./routes/categories");

const app = express();

app.listen(process.env.PORT_NUMBER, () => {
  console.log("welcome");
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/likes", likesRouter);
app.use("/orders", ordersRouter);
app.use("/carts", cartsRouter);
app.use("/categories", categoriesRouter);

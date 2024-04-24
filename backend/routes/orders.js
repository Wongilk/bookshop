//20240418 김원길
const express = require("express");
const {
  orders,
  getOrders,
  getOrdersDetail,
} = require("../controller/ordersController");
const router = express.Router();

router.use(express.json());

router
  .route("/")
  .post((req, res) => orders(req, res))
  .get((req, res) => getOrders(req, res));

router.get("/:orderId", (req, res) => getOrdersDetail(req, res));
module.exports = router;

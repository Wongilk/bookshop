const express = require("express");
const router = express.Router();
const {
  addCart,
  removeCart,
  getCart,
} = require("../controller/cartsController");
const { body } = require("express-validator");
const validate = require("../utils/validation");

router.use(express.json());

router
  .route("/")
  .post(
    [
      body("bookId").isNumeric().notEmpty().withMessage("올바르지 않은 bookId"),
      body("quantity")
        .isNumeric()
        .notEmpty()
        .withMessage("올바르지 않은 quantity"),
      validate,
    ],
    (req, res) => addCart(req, res)
  )
  .get((req, res) => getCart(req, res));

router.delete("/:cartItemId", (req, res) => removeCart(req, res));

module.exports = router;

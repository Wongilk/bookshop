const express = require("express");
const router = express.Router();
const { findAllBooks, findOneBook } = require("../controller/booksController");
const { query, param } = require("express-validator");
const validate = require("../utils/validation");

router.use(express.json());

router.get(
  "/",
  [
    query("limit").isNumeric().notEmpty().withMessage("올바르지 않은 limit"),
    query("currentPage")
      .isNumeric()
      .notEmpty()
      .withMessage("올바르지 않은 page"),
    validate,
  ],
  (req, res) => findAllBooks(req, res)
);

router.get(
  "/:bookId",
  param("bookId").notEmpty().withMessage("올바르지 않은 id"),
  (req, res) => findOneBook(req, res)
);

module.exports = router;

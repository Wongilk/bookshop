const express = require("express");
const router = express.Router();
const { addLike, removeLike } = require("../controller/likesController");
const { param, body } = require("express-validator");
const validate = require("../utils/validation");

router.use(express.json());

router
  .route("/:id")
  .post(
    [param("id").notEmpty().isNumeric().withMessage("올바르지 않은 bookId")],
    validate,
    (req, res) => addLike(req, res)
  )
  .delete(
    [param("id").notEmpty().isNumeric().withMessage("올바르지 않은 bookId")],
    validate,
    (req, res) => removeLike(req, res)
  );

module.exports = router;

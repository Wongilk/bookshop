const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../utils/validation");
const {
  join,
  login,
  passwordResetRequest,
  passwordReset,
} = require("../controller/userController");

router.use(express.json());

router.post(
  "/join",
  [
    body("email")
      .notEmpty()
      .isString()
      .withMessage("올바른 이메일이 아닙니다."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("올바른 비밀번호가 아닙니다."),
    validate,
  ],
  (req, res) => join(req, res)
);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isString()
      .withMessage("올바른 이메일이 아닙니다."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("올바른 비밀번호가 아닙니다."),
    validate,
  ],
  (req, res) => login(req, res)
);

router
  .route("/reset")
  .post(
    [
      body("email")
        .notEmpty()
        .isString()
        .withMessage("올바른 이메일이 아닙니다."),
      validate,
    ],
    (req, res) => passwordResetRequest(req, res)
  )
  .put(
    [
      body("email")
        .notEmpty()
        .isString()
        .withMessage("올바른 이메일이 아닙니다."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("올바른 비밀번호가 아닙니다."),
      validate,
    ],
    (req, res) => passwordReset(req, res)
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const findAllCategories = require("../controller/categoriesController");

router.get("/", (req, res) => findAllCategories(req, res));

module.exports = router;

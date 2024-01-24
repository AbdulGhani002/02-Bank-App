const express = require("express");

const baseController = require("../controllers/base.controller");

const router = express.Router();

router.get("/", baseController.getIndex);

router.get("/home", baseController.getHome);

module.exports = router;

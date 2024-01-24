const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/create-account", authController.getSignUp);
router.get("/login", authController.getLogin);
router.post("/create-account", authController.addAccount);

router.post("/login", authController.login);

module.exports = router;

const express = require("express");
const authController = require("../controllers/auth.controller");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.get("/create-account", authController.getSignup);
router.get("/login", authController.getLogin);
router.post("/create-account", accountController.createUserAndAccount);

router.post("/login", authController.login);

module.exports = router;

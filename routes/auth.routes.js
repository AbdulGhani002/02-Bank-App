const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/create-account", (req, res) => {
  res.render("customer/auth/create-account");
});
router.get("/login", (req, res) => {
  res.render("customer/auth/login");
});
router.post("/create-account", authController.addAccount);

router.post("/login", authController.login);

module.exports = router;

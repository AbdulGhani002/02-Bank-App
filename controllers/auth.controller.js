const User = require("../models/user.model");
const db = require("../data/database");

const addAccount = async (req, res) => {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.birthday,
    req.body.street,
    req.body.city,
    req.body.postalCode
  );
  try {
    const alreadyExists = await user.userAlreadyExists();
    if (alreadyExists) {
      return res.redirect("/login");
    }
    await user.signup();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const user = new User(req.body.email, req.body.password);

  try {
    const authenticatedUser = await user.login();

    if (authenticatedUser) {
      console.log("Authenticated:", authenticatedUser);
      return res.redirect("/");
    } else {
      console.log("Incorrect password or user not found");
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.redirect("/login");
  }
};

module.exports = {
  addAccount: addAccount,
  login: login,
};

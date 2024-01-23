const User = require("../models/user.model");

const addAccount = async (req, res) => {
  const user = new User(
    req.body.fullname,
    req.body.birthday,
    req.body.street,
    req.body.city,
    req.body.postalCode,
    req.body.email,
    req.body.password
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
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return console.log(error);
  }
  if (!existingUser) {
    return res.redirect("/login");
  }

  let isPasswordCorrect = await user.hasMatchingPassword(
    req.body.password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return res.redirect("/login");
  }
  if (isPasswordCorrect && existingUser) {
    console.log("authenticated");
    return res.redirect("/");
  }
};

module.exports = {
  addAccount: addAccount,
  login: login,
};

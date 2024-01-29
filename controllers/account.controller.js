const logger = require("../utils/logger");
const User = require("../models/user.model");
const Account = require("../models/account.model");
const sessionFlash = require("../utils/session-flash");

async function createUserAndAccount(req, res) {
  const { email, password, fullname, birthday, street, city, postalCode } =
    req.body;

  try {
    const newUser = new User(
      email,
      password,
      fullname,
      birthday,
      street,
      city,
      postalCode
    );

    const userExists = await newUser.userAlreadyExists();
    if (userExists) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: "User already exists",
      });
      return res.redirect("/signup");
    }

    const signupResult = await newUser.signup();
    if (!signupResult.success) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: signupResult.message || "Error during signup",
      });
      return res.redirect("/signup");
    }

    const createdUser = await newUser.getUserByEmail(email);
    logger.info("Created user:", {
      userId: createdUser.userId,
      email: createdUser.email,
    });

    if (createdUser && createdUser.userId) {
      const newAccount = new Account(createdUser.userId, 500);
      logger.info("New account data:", {
        accountId: newAccount.accountId,
        accountNumber: newAccount.accountNumber,
        balance: newAccount.balance,
      });

      await newAccount.createBankAccount();

      sessionFlash.flashDataToSession(req, {
        successMessage: "User and account created successfully",
      });

      return res.redirect("/login");
    } else {
      sessionFlash.flashDataToSession(req, {
        errorMessage: "Error creating user account",
      });
      return res.redirect("/signup");
    }
  } catch (error) {
    logger.error("Error during user and account creation:", error);
    sessionFlash.flashDataToSession(req, {
      errorMessage: "Internal Server Error",
    });
    return res.redirect("/signup");
  }
}

module.exports = {
  createUserAndAccount,
};

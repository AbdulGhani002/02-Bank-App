const logger = require("../utils/logger");
const User = require("../models/user.model");
const Account = require("../models/account.model");

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
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const signupResult = await newUser.signup();
    if (!signupResult.success) {
      return res
        .status(500)
        .json({ success: false, message: signupResult.message });
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

      return res.status(201).json({
        success: true,
        message: "User and account created successfully",
      });
    } else {

      return res
        .status(500)
        .json({ success: false, message: "Error creating user account" });
    }
  } catch (error) {

    logger.error("Error during user and account creation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  createUserAndAccount,
};

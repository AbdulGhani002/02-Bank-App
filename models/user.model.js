const bcrypt = require("bcryptjs");
const db = require("../data/database");

class User {
  constructor(fullname, birthday, street, city, postalCode, email, password) {
    this.name = fullname;
    this.birthday = birthday;
    this.address = {
      street: street,
      city: city,
      postalCode: postalCode,
    };
    this.email = email;
    this.password = password;
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async userAlreadyExists() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = bcrypt.hashSync(this.password, 12);

    const newUser = {
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    };

    try {
      const alreadyExists = await this.userAlreadyExists();

      if (alreadyExists) {
        return res.redirect("/login");
      }

      await db.getDb().collection("Accounts").insertOne(newUser);
      return { success: true };
    } catch (error) {
      console.error("Error during signup:", error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async login() {
    return await db
      .getDb()
      .collection("Accounts")
      .findOne({ email: this.email });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;

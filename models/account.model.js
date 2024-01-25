const { v4: uuidv4 } = require("uuid");
const db = require("../data/database");

class Account {
  constructor(accountId, balance) {
    this.accountId = accountId;
    this.balance = balance || 0; 
    this.accountNumber = this.generateAccountNumber();
  }

  generateAccountNumber() {
    const prefix = "MHCA";
    const uniqueId = uuidv4().split("-").join("").toUpperCase().substring(0, 8);
    return `${prefix}-${uniqueId}`;
  }

  async createBankAccount() {
    const newAccount = {
      accountId: this.accountId,
      accountNumber: this.accountNumber,
      balance: this.balance,
    };
    return db.getDb().collection("Accounts").insertOne(newAccount);
  }

  async getAccountData() {
    try {
      const account = await db
        .getDb()
        .collection("Accounts")
        .findOne({ accountId: this.accountId });
      if (!account) {
        throw new Error("Account not found!");
      } else {
        return account;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = Account;

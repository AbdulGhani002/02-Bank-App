const express = require("express");
const { join } = require("path");
const db = require("./data/database");

const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(baseRoutes);
app.use(authRoutes);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
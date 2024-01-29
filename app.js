const express = require("express");
const { join } = require("path");
const csrf = require("csurf");
const helmet = require("helmet");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const db = require("./data/database");
const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");

const errorHandlerMiddleware = require("./middlewares/error-handler");
const expressSessionsConfig = require("./config/sessions");
const generateCsrfToken = require("./middlewares/csrf-token");

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static("pictures"));
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(expressSessionsConfig);
app.use(csrf({ cookie: true }));
app.use(generateCsrfToken);

app.use(baseRoutes);
app.use(authRoutes);
app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });

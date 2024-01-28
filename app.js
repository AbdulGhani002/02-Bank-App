// app.js
const express = require("express");
const { join } = require("path");
const csrf = require('csurf');
const db = require("./data/database");
const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");

const errorHandlerMiddleware = require("./middlewares/error-handler");
const expressSessionsMiddleware = require("./middlewares/sessions");
const generateCsrfToken = require('./middlewares/csrf-token');

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static("pictures"));
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);

app.use(expressSessionsMiddleware);
app.use(csrf());
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

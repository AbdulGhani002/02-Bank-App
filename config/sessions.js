const expressSession = require("express-session");
const MongoStore = require('connect-mongo');

const { v4: uuidv4 } = require("uuid");

const mongoStore = MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/moneyhub",
    ttl: 30 * 24 * 60 * 60,
});

const genuuid = () => {
    return uuidv4();
};

const sessions = expressSession({
    secret: "iAmAbdulGhani",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 30 * 24 * 60 * 60,
    },
    genid: function (req) {
        return genuuid();
    },
    store: mongoStore,
});
console.log(mongoStore)
module.exports = sessions;

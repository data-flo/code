const fs = require("fs");
const express = require("express");

const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const MongoSessionStore = require("connect-mongo")(session);
const formData = require("express-form-data");
const os = require("os");

const userAccounts = require("cgps-user-accounts/src");
const userStore = require("./utils/user-store");

const config = require("./utils/config");
const accessTokenMiddleware = require("./access-token-middleware");

const app = express();

app.use(
  bodyParser.json({ limit: "500mb" })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  })
);

app.use(
  formData.parse({
    uploadDir: os.tmpdir(),
    autoClean: true,
  })
);
app.use((req, _, next) => {
  if (req.files) {
    const keys = Object.keys(req.files);
    for (const key of keys) {
      const { name, type, path } = req.files[key];
      const stream = fs.createReadStream(path);
      stream.name = name;
      stream.mediaType = type;
      req.files[key] = stream;
    }
  }
  next();
});
app.use(formData.union());

// required for passport
app.use(cookieParser());

if (process.env.npm_lifecycle_script !== "nuxt build") {
  app.use(
    session({
      secret: config.node.sessionSecret,
      store: new MongoSessionStore({ url: config.mongodb.url }),
      resave: true,
      saveUninitialized: true,
    })
  );

  mongoose.connect(
    config.mongodb.url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  mongoose.connection.on(
    "error",
    (error) => {
      console.error(error);
      process.exit(1);
    }
  );
}


// configure user accounts
userAccounts(app, {
  userStore,
  url: config.passport.url,
  authPath: "/auth",
  successRedirect: `${config.passport.url}/transformations`,
  failureRedirect: `${config.passport.url}/signin`,
  logoutRedirect: config.passport.url,
  logoutPath: "/auth/signout",
  strategies: config.passport.strategies,
  redirectToReferrer: false,
});

app.use(accessTokenMiddleware);

app.use((req, res, next) => {
  req.config = config;
  next();
});


let shuttingDown = false;
app.use((_, res, next) => {
  if (shuttingDown) {
    res.header("Connection", "close");
    res.status(502).send("Server is shutting down");
    return;
  }
  next();
});

process.on("SIGTERM", async () => {
  shuttingDown = true;
  console.warn("Received stop signal (SIGTERM), shutting down gracefully");
  await mongoose.connection.close();
  console.log("Closed out remaining connections");
  process.exit();
});

app.use("/api", require("./routes"));

module.exports = app;

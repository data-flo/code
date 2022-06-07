const http = require("http");
const express = require("express");

const api = require("./index");
const config = require("./utils/config");

const app = express();

app.set("hostname", process.env.HOSTNAME || config.node.hostname);
app.set("port", process.env.PORT || config.node.port);

const nodeEnv = process.env.NODE_ENV || "production";
require("console-stamp")(console, "HH:MM:ss.l");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});


app.use(api());

const httpServer = http.createServer(app);

httpServer.listen(app.get("port"), () => {
  console.log(
    `Server is listening on port ${app.get("port")}. NODE_ENV=${nodeEnv}`
  );
});

httpServer.on("close", () => {
  console.log("closing server");
});

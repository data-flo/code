/* eslint no-unused-vars: 0 */

const express = require("express");

const { catchErrorResponse } = require("../errors");

const apiRouter = express.Router();

apiRouter
  .use("/adaptors", require("./adaptors"))
  .use("/dataflows", require("./dataflows"))
  .use("/transformations", require("./transformations"))
  .use((err, req, res, next) => {
    console.error(err.stack);
    catchErrorResponse(res, err);
  });

module.exports = apiRouter;

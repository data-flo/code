const express = require("express");

const router = express.Router();

router.use("/list", require("./list"));

module.exports = router;

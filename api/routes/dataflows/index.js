const express = require("express");

const router = express.Router();

const getDataflowByIdentifier = require("./get-dataflow-by-identifier");
const requireOwnerAccess = require("./require-owner-access");
const requireUser = require("../require-user");

router.use(
  "/create",
  requireUser,
  require("./create")
);

router.use(
  "/delete/:id",
  getDataflowByIdentifier,
  requireOwnerAccess,
  require("./delete")
);

router.use(
  "/edit/:id",
  getDataflowByIdentifier,
  requireOwnerAccess,
  require("./edit")
);

router.use(
  "/clone/:id",
  requireUser,
  getDataflowByIdentifier,
  require("./clone")
);

router.use(
  "/export/:id",
  getDataflowByIdentifier,
  require("./export")
);

router.use(
  "/import",
  requireUser,
  require("./import")
);

router.use(
  "/info/:id",
  getDataflowByIdentifier,
  require("./info")
);

router.use(
  "/list",
  require("./list")
);

router.use(
  "/manifest/:id",
  getDataflowByIdentifier,
  requireOwnerAccess,
  require("./manifest")
);

router.use(
  "/run/:id",
  getDataflowByIdentifier,
  require("./run")
);

module.exports = router;

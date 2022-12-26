const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const driverController = require("../controllers/driver");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes

router.get("/", ensureAuth, driverController.getDriverMainPage);

module.exports = router;
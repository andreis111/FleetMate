const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const driverController = require("../controllers/driver");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Route
router.get("/", ensureAuth, driverController.getDriverMainPage);

//Truck Route
router.get("/truck", ensureAuth, driverController.getTruck);

//Spreadsheet Route
router.get("/spreadsheet", ensureAuth, driverController.getSpreadsheet);
router.post("/spreadsheet/createWeek", ensureAuth, driverController.postCreateSpreadsheet);
router.get("/spreadsheet/:id", ensureAuth, driverController.getIndividualSpreadsheet);
router.post("/spreadsheet/createIndividual/:id", ensureAuth, driverController.postIndividualTrip);

//Repair Routes
router.get("/repairs", ensureAuth, driverController.getRepair);
router.post("/repairs", ensureAuth, driverController.postRepair);

module.exports = router;
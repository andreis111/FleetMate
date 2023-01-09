const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const driverController = require("../controllers/driver");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Route
router.get("/", ensureAuth, driverController.getDriverMainPage);

//Profile Route
router.get("/profile", ensureAuth, driverController.getDriverProfile);
router.put("/profile/edit", ensureAuth, driverController.putEditDriver);

//Truck Route
router.get("/truck", ensureAuth, driverController.getTruck);

//Spreadsheet Route
router.get("/spreadsheet", ensureAuth, driverController.getSpreadsheet);
router.post("/spreadsheet/createWeek", ensureAuth, driverController.postCreateSpreadsheet);
router.get("/spreadsheet/:id", ensureAuth, driverController.getIndividualSpreadsheet);
router.post("/spreadsheet/createIndividual/:id", ensureAuth, driverController.postIndividualTrip);
router.put("/spreadsheet/complete/:id", ensureAuth, driverController.putCompleteWeek);

//Repair Routes
router.get("/repairs", ensureAuth, driverController.getRepair);
router.post("/repairs", ensureAuth, driverController.postRepair);

module.exports = router;
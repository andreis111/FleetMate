const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
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
router.delete("/spreadsheet/delete/:id", ensureAuth, driverController.deleteSpreadsheet);

//Individual trips Route
router.get("/spreadsheet/:id", ensureAuth, driverController.getIndividualSpreadsheet);
router.post("/spreadsheet/createIndividual/:id", upload.single("file"), ensureAuth, driverController.postIndividualTrip);
router.put("/spreadsheet/complete/:id", ensureAuth, driverController.putCompleteWeek);
router.get("/spreadsheet/editIndividual/:weekId/:individualId", ensureAuth, driverController.getEditIndividual);
router.put("/spreadsheet/editIndividual/:weekId/:individualId", upload.single("file"), ensureAuth, driverController.putEditIndividual);
router.delete("/spreadsheet/deleteIndividual/:weekId/:individualId", ensureAuth, driverController.deleteIndividual);

//Repair Routes
router.get("/repairs", ensureAuth, driverController.getRepair);
router.post("/repairs", ensureAuth, upload.single("file"), driverController.postRepair);
router.delete("/repairs/delete/:id", ensureAuth, driverController.deleteRepair);

module.exports = router;
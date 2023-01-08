const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const driverController = require("../controllers/driver");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes

router.get("/", ensureAuth, adminController.getAdminMainPage);
router.get("/profile", ensureAuth, adminController.getAdminProfile);

//admin-truck
router.get("/trucks", ensureAuth, adminController.getTrucks);
router.get("/trucks/createTruck", ensureAuth, adminController.getCreateTruck);
router.post("/trucks/createTruck", ensureAuth, adminController.postCreateTruck);
router.get("/trucks/edit/:id", ensureAuth, adminController.getEditTruck);
router.put("/trucks/edit/:id", ensureAuth, adminController.putEditTruck);
router.delete("/trucks/deleteTruck/:id", ensureAuth, adminController.deleteTruck);

//admin-driver
router.get("/drivers", ensureAuth, adminController.getDrivers);
router.get("/drivers/createDriver", ensureAuth, adminController.getCreateDriver);
router.post("/drivers/createDriver", ensureAuth, authController.postSignupDriver);
router.get("/drivers/edit/:id", ensureAuth, adminController.getEditDriver);
router.put("/drivers/edit/:id", ensureAuth, adminController.putEditDriver);
router.delete("/drivers/deleteDriver/:id", ensureAuth, adminController.deleteDriver);

//spreadsheets
router.get("/spreadsheets", ensureAuth, adminController.getSpreadsheets);
router.get("/spreadsheet/:id", ensureAuth, adminController.getIndividualSpreadsheet);

//repairs
router.get("/repairs", ensureAuth, adminController.getRepairs);
router.post("/updateRepair", ensureAuth, adminController.updateRepair);

module.exports = router;
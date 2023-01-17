const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const driverController = require("../controllers/driver");
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { checkRestrict } = require("../middleware/restrict");

//Main Routes

router.get("/", ensureAuth, adminController.getAdminMainPage);
router.get("/access-denied", ensureAuth, adminController.getDenied);

//Profile
router.get("/profile", ensureAuth, adminController.getAdminProfile);
router.put("/profile/edit", checkRestrict, upload.single("file"), ensureAuth, adminController.putEditAdmin);
router.put("/profile/delete", checkRestrict, upload.single("file"), ensureAuth, adminController.deletePhoto);

// //Company
// router.post("/profile/createCompany", ensureAuth, adminController.postCreateCompany);
// router.put("/profile/editCompany", ensureAuth, adminController.putEditCompany);

//admin-truck
router.get("/trucks", ensureAuth, adminController.getTrucks);
router.get("/trucks/createTruck", ensureAuth, adminController.getCreateTruck);
router.post("/trucks/createTruck", checkRestrict, ensureAuth, adminController.postCreateTruck);
router.get("/trucks/edit/:id", ensureAuth, adminController.getEditTruck);
router.put("/trucks/edit/:id", checkRestrict, ensureAuth, adminController.putEditTruck);
router.delete("/trucks/deleteTruck/:id", checkRestrict, ensureAuth, adminController.deleteTruck);

router.post("/trucks/addCustom/:id", checkRestrict, ensureAuth, adminController.postCustomOption);

//admin-driver
router.get("/drivers", ensureAuth, adminController.getDrivers);
router.get("/drivers/createDriver", ensureAuth, adminController.getCreateDriver);
router.post("/drivers/createDriver", checkRestrict, ensureAuth, authController.postSignupDriver);
router.get("/drivers/edit/:id", ensureAuth, adminController.getEditDriver);
router.put("/drivers/edit/:id", checkRestrict, ensureAuth, adminController.putEditDriver);
router.delete("/drivers/deleteDriver/:id", checkRestrict, ensureAuth, adminController.deleteDriver);

//spreadsheets
router.get("/spreadsheets", ensureAuth, adminController.getSpreadsheets);
router.get("/spreadsheets/filter", ensureAuth, adminController.filterSpreadsheets);
router.get("/spreadsheet/:id", ensureAuth, adminController.getIndividualSpreadsheet);

//repairs
router.get("/repairs", ensureAuth, adminController.getRepairs);
router.get("/repairs/filter", ensureAuth, adminController.filterRepairs);
router.post("/updateRepair", checkRestrict, ensureAuth, adminController.updateRepair);

module.exports = router;
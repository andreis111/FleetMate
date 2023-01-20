const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const driverController = require("../controllers/driver");
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { checkRestrict } = require("../middleware/restrict");
const { checkAdmin } = require("../middleware/checkRole");

//Main Routes

router.get("/",checkAdmin, ensureAuth, adminController.getAdminMainPage);
router.get("/access-denied",checkAdmin, ensureAuth, adminController.getDenied);

//Profile
router.get("/profile",checkAdmin, ensureAuth, adminController.getAdminProfile);
router.put("/profile/edit", checkRestrict, upload.single("file"), ensureAuth, adminController.putEditAdmin);
router.put("/profile/delete", checkRestrict, upload.single("file"), ensureAuth, adminController.deletePhoto);

// //Company
// router.post("/profile/createCompany", ensureAuth, adminController.postCreateCompany);
// router.put("/profile/editCompany", ensureAuth, adminController.putEditCompany);

//admin-truck
router.get("/trucks",checkAdmin, ensureAuth, adminController.getTrucks);
router.get("/trucks/createTruck",checkAdmin, ensureAuth, adminController.getCreateTruck);
router.post("/trucks/createTruck", checkRestrict, ensureAuth, adminController.postCreateTruck);
router.get("/trucks/edit/:id",checkAdmin, ensureAuth, adminController.getEditTruck);
router.put("/trucks/edit/:id", checkRestrict, ensureAuth, adminController.putEditTruck);
router.delete("/trucks/deleteTruck/:id", checkRestrict, ensureAuth, adminController.deleteTruck);

router.post("/trucks/addCustom/:id", checkRestrict, ensureAuth, adminController.postCustomOption);

//admin-driver
router.get("/drivers",checkAdmin, ensureAuth, adminController.getDrivers);
router.get("/drivers/createDriver",checkAdmin, ensureAuth, adminController.getCreateDriver);
router.post("/drivers/createDriver", checkRestrict, ensureAuth, authController.postSignupDriver);
router.get("/drivers/edit/:id",checkAdmin, ensureAuth, adminController.getEditDriver);
router.put("/drivers/edit/:id", checkRestrict, ensureAuth, adminController.putEditDriver);
router.delete("/drivers/deleteDriver/:id", checkRestrict, ensureAuth, adminController.deleteDriver);

//spreadsheets
router.get("/spreadsheets",checkAdmin, ensureAuth, adminController.getSpreadsheets);
router.get("/spreadsheets/filter",checkAdmin, ensureAuth, adminController.filterSpreadsheets);
router.get("/spreadsheet/:id",checkAdmin, ensureAuth, adminController.getIndividualSpreadsheet);

//repairs
router.get("/repairs",checkAdmin, ensureAuth, adminController.getRepairs);
router.get("/repairs/filter",checkAdmin, ensureAuth, adminController.filterRepairs);
router.post("/updateRepair", ensureAuth, adminController.updateRepair);

module.exports = router;
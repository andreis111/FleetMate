const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes

router.get("/", ensureAuth, adminController.getAdminMainPage);
router.get("/trucks", ensureAuth, adminController.getTrucks);
router.get("/trucks/createTruck", ensureAuth, adminController.getCreateTruck);
router.post("/trucks/createTruck", ensureAuth, adminController.postCreateTruck);
router.get("/trucks/edit/:id", ensureAuth, adminController.getEditTruck);
router.put("/trucks/edit/:id", ensureAuth, adminController.putEditTruck);
router.delete("/trucks/deleteTruck/:id", ensureAuth, adminController.deleteTruck);

module.exports = router;
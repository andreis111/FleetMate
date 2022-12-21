const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes

router.get("/", ensureAuth, adminController.getAdminMainPage);
// router.get("/staff", adminController.getStaff);
// router.get("/tasksCompleted", adminController.getTasksCompleted);
// router.post("/createStaff", authController.createStaff);

module.exports = router;
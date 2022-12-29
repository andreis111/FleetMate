const Driver = require("../models/Driver");
const Truck = require("../models/Truck");
const WeeklySs = require("../models/WeeklySs");
const Individual = require("../models/IndividualTrip");

module.exports = {

    //main page
    getDriverMainPage: async (req, res) => {
    try {
            //   const tasks = await Task.find({completedBy: null}).sort({createdDate: 'desc'}).lean();
            //   const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id }).lean()
            res.render("driverMainPage", { driver: req.user });

        } catch (err) {
            console.log(err);
        }
    },

    //Get truck assigned page
  getTruck: async (req, res) => {
    const truck = await Truck.findById(req.user.truckId)
        try {
          res.render("truckDriver.ejs", {truck:truck});
        } catch (err) {
          console.log(err);
        }
    },
    
    //Spreadsheet
    getSpreadsheet: async (req, res) => {
      const weekly = await WeeklySs.find({ createdBy: req.user.id })
      
        try {
          res.render("spreadsheetDriver.ejs", { weekly: weekly});
        } catch (err) {
          console.log(err);
        }
    },

    postCreateSpreadsheet: async (req, res) => {
        try {
          // Upload image to cloudinary
          // const result = await cloudinary.uploader.upload(req.file.path);
    
          await WeeklySs.create({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: req.user.id,
            truckId: req.user.truckPlate,
            userName: req.user.userName,
          });
          console.log("Spreadsheet has been added!");
          res.redirect("/driver/spreadsheet");
        } catch (err) {
          console.log(err);
        }
    },
    
    getIndividualSpreadsheet: async (req, res) => {
        try {
            const week = await WeeklySs.findById(req.params.id);
            const individuals = await Individual.find({ weekId: req.params.id })
            
            //sum for Km, Other Costs, Fuel
            let totalKm = 0
            let totalCosts = 0
            let totalFuel = 0
            for (let i = 0; i < individuals.length; i++) {
                totalKm += individuals[i].km;
                totalCosts += individuals[i].otherCosts;
                totalFuel += individuals[i].fuel;
              }
            console.log(totalKm);
          res.render("individualSpreadsheetDriver.ejs", { week: week, user: req.user, individuals: individuals, totalKm:totalKm, totalCosts: totalCosts, totalFuel:totalFuel  });
        } catch (err) {
          console.log(err);
        }
    },
    
    postIndividualTrip: async (req, res) => {
        try {
          // Upload image to cloudinary
          // const result = await cloudinary.uploader.upload(req.file.path);
            
            await Individual.create({
            startLoc: req.body.startLoc,
            endLoc: req.body.endLoc,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            km: req.body.km,
            fuel: req.body.fuel,
            otherCosts: req.body.otherCosts,
            notes: req.body.notes,
            truckPlate: req.user.truckPlate,
            weekId: req.params.id
          });
          console.log("Trip has been added!");
          res.redirect(`/driver/spreadsheet/${req.params.id}`);
        } catch (err) {
          console.log(err);
        }
    },

    //To Repair
    getRepair: async (req, res) => {
        
        try {
          res.render("toRepairDriver.ejs");
        } catch (err) {
          console.log(err);
        }
    },
    
}
const Driver = require("../models/Driver");
const Truck = require("../models/Truck");
const WeeklySs = require("../models/WeeklySs");
const Individual = require("../models/IndividualTrip");
const Repair = require("../models/Repair");
const Company = require("../models/Company");

module.exports = {

    //main page
  getDriverMainPage: async (req, res) => {
    try {
            //   const tasks = await Task.find({completedBy: null}).sort({createdDate: 'desc'}).lean();
            //   const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id }).lean()
            res.render("driverMainPage", { user: req.user });

        } catch (err) {
            console.log(err);
        }
  },
  //driver profile
  getDriverProfile: async (req, res) => {
    try {
      const company = await Company.find({ adminId: req.user.adminId });
      if (req.user.role === 'Driver') {
        if (company.length > 0) {
          // render the edit form
          res.render("profileDriver", {user : req.user, company: company, companyExist: true});
        } else {
          // render the create button
          res.render("profileDriver", {user : req.user, companyExist: false});
        }
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
  },
  putEditDriver: async (req, res) => {
    //iterate to see if body is empty or not and delete the empty fields
    Object.keys(req.body).forEach((key) => {
      if (
        req.body[key] == null ||
        req.body[key] == undefined ||
        req.body[key] == ''
      ) {
        delete req.body[key]
      }
    })
    try {
      await Driver.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: req.body,
        }
      );
      console.log("Driver updated");
      res.redirect(`/driver/profile`);
    } catch (err) {
      console.log(err);
    }
  },


    //Get truck assigned page
  getTruck: async (req, res) => {
    const truck = await Truck.findById(req.user.truckId)
        try {
          res.render("truckDriver.ejs", {truck:truck, user: req.user});
        } catch (err) {
          console.log(err);
        }
    },
    
    //Spreadsheet
    getSpreadsheet: async (req, res) => {
      
      const weekly = await WeeklySs.find({ createdBy: req.user.id }).sort({ createdAt: "desc" });
      
      // Filter for completed or not completed spreadsheets so it will show different in ejs
      const completed = weekly.filter(week => week.completed === true);
      const notCompleted = weekly.filter(week => week.completed === false);
      
        try {
          res.render("spreadsheetDriver.ejs", { completed: completed, notCompleted: notCompleted, user: req.user });
        } catch (err) {
          console.log(err);
        }
    },

  postCreateSpreadsheet: async (req, res) => {
    const truck = await Truck.findById(req.user.truckId)
        try {
          // Upload image to cloudinary
          // const result = await cloudinary.uploader.upload(req.file.path);
    
          await WeeklySs.create({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: req.user.id,
            truckId: req.user.truckId,
            userName: req.user.userName,
            truckPlate: truck.plate
          });
          console.log("Spreadsheet has been added!");
          res.redirect("/driver/spreadsheet");
        } catch (err) {
          console.log(err);
        }
  },
  
  deleteSpreadsheet: async (req, res) => {
    try {
      await WeeklySs.deleteOne({ _id: req.params.id });
      await Individual.deleteMany({ weekId: req.params.id });
      console.log("Deleted Spreadsheet and linked jobs");
      res.redirect("/driver/spreadsheet");
    } catch (err) {
      console.log(err);
      res.redirect("/driver/spreadsheet");
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
  putCompleteWeek: async (req, res) => {
    try {
      await WeeklySs.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { completed: true },
        }
      );
      console.log("Week completed");
      res.redirect(`/driver/spreadsheet/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  // Edit individual trips
  getEditIndividual: async (req, res) => {
    try {
        const week = await WeeklySs.findById(req.params.weekId);
        const individuals = await Individual.find({ weekId: req.params.weekId })
        const editTrip = await Individual.findById(req.params.individualId)
        
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
      res.render("editIndividualSpreadsheetDriver.ejs", { week: week, user: req.user, individuals: individuals, totalKm:totalKm, totalCosts: totalCosts, totalFuel:totalFuel, editTrip: editTrip  });
    } catch (err) {
      console.log(err);
    }
  },
  
  putEditIndividual: async (req, res) => {
    //iterate to see if body is empty or not and delete the empty fields
    Object.keys(req.body).forEach((key) => {
      if (
        req.body[key] == null ||
        req.body[key] == undefined ||
        req.body[key] == ''
      ) {
        delete req.body[key]
      }
    })
    try {
      await Individual.findOneAndUpdate(
        { _id: req.params.individualId },
        {
          $set: req.body,
        }
      );
      console.log("Driver updated");
      res.redirect(`/driver/spreadsheet/${req.params.weekId}`);
    } catch (err) {
      console.log(err);
    }
  },


  deleteIndividual: async (req, res) => {
    try {
      await Individual.deleteOne({ _id: req.params.individualId });
      console.log("Deleted job");
      res.redirect(`/driver/spreadsheet/${req.params.weekId}`);
    } catch (err) {
      console.log(err);
      res.redirect(`/driver/spreadsheet/${req.params.weekId}`);
    }
},


                      //To Repair
    getRepair: async (req, res) => {
      const repairs = await Repair.find({ createdBy: req.user.id })
        try {
          res.render("toRepairDriver.ejs", {repairs: repairs, user: req.user});
        } catch (err) {
          console.log(err);
        }
    },
    
  postRepair: async (req, res) => {
    const truck = await Truck.findById(req.user.truckId)
      try {
        // Upload image to cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path);

          await Repair.create({
            content: req.body.content,
            truckPlate: truck.plate,
            createdBy: req.user.id,
            truckId: req.user.truckId,
        });
        console.log("Repair has been added!");
        res.redirect(`/driver/repairs/`);
      } catch (err) {
        console.log(err);
      }
  },
  deleteRepair: async (req, res) => {
    try {
      await Repair.deleteOne({ _id: req.params.id });
      console.log("Deleted Repair");
      res.redirect(`/driver/repairs`);
    } catch (err) {
      console.log(err);
      res.redirect(`/driver/repairs`);
    }
},
    
}
const Admin = require("../models/Admin");
const Driver = require("../models/Driver");
const Truck = require("../models/Truck");
//WeeklySs and Individuals are both in same collection, but 2 different models. multiple Individual are linked to one WeeklySs
const WeeklySs = require("../models/WeeklySs");
const Individual = require("../models/IndividualTrip");
const Repair = require("../models/Repair");
const Company = require("../models/Company");

module.exports = {

  //render the admin main page
  getAdminMainPage: async (req, res) => {
    try {
      //   const tasks = await Task.find({completedBy: null}).sort({createdDate: 'desc'}).lean();
      //   const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id }).lean()
      if (req.user.role === 'admin') {
        res.render("adminMainPage.ejs", {user : req.user});
      } else {
        res.redirect("/driver")
      }

    } catch (err) {
      console.log(err);
    }
  },

  //Admin profile 
  getAdminProfile: async (req, res) => {
    try {
      const company = await Company.find({ adminId: req.user.id });
      console.log(company);
      if (req.user.role === 'admin') {
        if (company.length > 0) {
          // render the edit form
          res.render("profileAdmin", {user : req.user, company: company, companyExist: true});
        } else {
          // render the create button
          res.render("profileAdmin", {user : req.user, companyExist: false});
        }
      } else {
        res.redirect("/admin/profile");
      }
    } catch (err) {
      console.log(err);
    }
  },
  putEditAdmin: async (req, res) => {
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
      await Admin.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: req.body,
        }
      );
      console.log("Admin updated");
      res.redirect(`/admin/profile`);
    } catch (err) {
      console.log(err);
    }
  },

  //COmpany
  postCreateCompany: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await Company.create({
        name: req.body.name,
        address: req.body.address,
        vat: req.body.vat,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        contactEmail: req.body.contactEmail,
        adminId: req.user.id
      });
      console.log("Company has been added!");
      res.redirect("/admin/profile");
    } catch (err) {
      console.log(err);
    }
  },

  putEditCompany: async (req, res) => {
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
      await Company.findOneAndUpdate(
        { adminId: req.user.id },
        {
          $set: req.body,
        }
      );
      console.log("Company updated");
      res.redirect(`/admin/profile`);
    } catch (err) {
      console.log(err);
    }
  },

                  //TRUCKS controllers:
  
    //get all trucks, find "trucks" created by the admin
  getTrucks: async (req, res) => {
    const trucks = await Truck.find({ adminId: req.user.id })
    try {
      res.render("trucksAdmin.ejs", { trucks: trucks, user : req.user });
    } catch (err) {
      console.log(err);
    }
  },

    //get the createTruck page
  getCreateTruck: async (req, res) => {
    try {
      res.render("createTruckAdmin.ejs", {user : req.user});
    } catch (err) {
      console.log(err);
    }
  },

    //creating new truck using Truck model and taking all inputs from createTruckAdmin.ejs
  postCreateTruck: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await Truck.create({
        type: req.body.type,
        model: req.body.model,
        plate: req.body.plate,
        chassis: req.body.km,
        toRepair: req.body.toRepair,
        photos: req.body.photos,
        expireVignette: req.body.expireVignette,
        expireInsurance: req.body.expireInsurance,
        expireCmr: req.body.expireCmr,
        km: req.body.km,
        adminId: req.user.id
      });
      console.log("Truck has been added!");
      res.redirect("/admin/trucks");
    } catch (err) {
      console.log(err);
    }
  },
  
    //get the editTruck page. find the truck by id and driver so we can pass by default the value that will be edited
  getEditTruck: async (req, res) => {
    try {
      const truck = await Truck.findById(req.params.id);
      const driver = await Driver.find({ truckPlate: req.params.id })
      res.render("editTruckAdmin.ejs", { truck: truck, user: req.user , driver: driver});
    } catch (err) {
      console.log(err);
    }
  },

    //edit truck. if body inputs empty then delete and edit only the ones we need
  putEditTruck: async (req, res) => {
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
      await Truck.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: req.body,
        }
      );
      console.log("Truck updated");
      res.redirect(`/admin/trucks`);
    } catch (err) {
      console.log(err);
    }
  },

    //delete truck, find it by id and .deleteOne (using a trash icon in ejs)
  deleteTruck: async (req, res) => {
    try {
      // Find post by id
      let truck = await Truck.findById({ _id: req.params.id });
      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Truck.deleteOne({ _id: req.params.id });
      console.log("Deleted Truck");
      res.redirect("/admin/trucks");
    } catch (err) {
      res.redirect("/admin/trucks");
    }
  },

                  //DRIVERS controllers
  
    //Get drivers main page, iterate through all 'drivers' created by the admin and show them in ejs. 'truck' will check in ejs too
  getDrivers: async (req, res) => {
    const drivers = await Driver.find({ adminId: req.user.id })
    const truck = await Truck.find()
    try {
      res.render("driversAdmin.ejs", { drivers: drivers, truck : truck, user : req.user });
    } catch (err) {
      console.log(err);
    }
  },
    //get the createDriver page - the put in createDriver is in auth controller
  getCreateDriver: async (req, res) => {
    try {
      res.render("createDriverAdmin.ejs", {user : req.user});
    } catch (err) {
      console.log(err);
    }
  },

    //edit the driver page
  getEditDriver: async (req, res) => {
    try {
      const trucks = await Truck.find({ adminId: req.user.id })
      const driver = await Driver.findById(req.params.id);
      
      //Find truck assigned
      const assignedTruck = await Truck.findById(driver.truckId)

      //if there is a truck assigned give the plate, if not default message 'No truck assigned'
      const truckPlate = assignedTruck?.plate || 'No truck assigned';

      res.render("editDriverAdmin.ejs", { driver: driver, user: req.user, trucks: trucks, truckPlate: truckPlate });
    } catch (err) {
      console.log(err);
    }
  },

    //editing it, iterate to see if body empty or not, if empty delete
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
      // Check if truckId is "noTruck"
    if (req.body.truckId === 'noTruck') {
      // If it is, set truckId to null
      req.body.truckId = null;
    }
    try {
      await Driver.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: req.body,
        }
      );
      console.log("Driver updated");
      res.redirect(`/admin/drivers/edit/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteDriver: async (req, res) => {
    try {
      // Find driver by id
      let driver = await Driver.findById({ _id: req.params.id });
      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Driver.deleteOne({ _id: req.params.id });
      console.log("Deleted Driver");
      res.redirect("/admin/drivers");
    } catch (err) {
      res.redirect("/admin/drivers");
    }
  },


              
              //SPREADSHEET controllers:
  
  
    getSpreadsheets: async (req, res) => {
      const drivers = await Driver.find({ adminId: req.user.id })
      const driversIds = drivers.map(driver => driver.id)
      const weekly = await WeeklySs.find({ createdBy: {$in: driversIds} }).sort({ createdAt: 'desc' })
      const individuals = await Individual.find({ createdBy: weekly.id })
      try {
        res.render("spreadsheetsAdmin.ejs", {weekly: weekly, user : req.user});
      } catch (err) {
        console.log(err);
      }
    },

  getIndividualSpreadsheet: async (req, res) => {
    try {
        const week = await WeeklySs.findById(req.params.id);
        const individuals = await Individual.find({ weekId: week.id })
        console.log(week);
        //sum for Km, Other Costs, Fuel
        let totalKm = 0
        let totalCosts = 0
        let totalFuel = 0
        for (let i = 0; i < individuals.length; i++) {
            totalKm += individuals[i].km;
            totalCosts += individuals[i].otherCosts;
            totalFuel += individuals[i].fuel;
          }
      res.render("individualSpreadsheetAdmin.ejs", { week: week, user: req.user, individuals: individuals, totalKm:totalKm, totalCosts: totalCosts, totalFuel:totalFuel, user : req.user  });
    } catch (err) {
      console.log(err);
    }
},

    //Repair controllers:
    getRepairs: async (req, res) => {
      const drivers = await Driver.find({ adminId: req.user.id });
      const driverIds = drivers.map(driver => driver.id);
      const repairs = await Repair.find({ createdBy: { $in: driverIds } });
      try {
        res.render("toRepairAdmin.ejs", {repairs: repairs, user : req.user});
      } catch (err) {
        console.log(err);
      }
  },
    
  updateRepair: async (req, res) => {
    try {
      // Find the repair in the database
      const repair = await Repair.findById(req.body.id);
      // Toggle the completed field
      repair.completed = !repair.completed;
      // Save the updated repair
      await repair.save();
      res.send('OK');
    } catch (error) {
      console.error(error);
      res.send('Error');
    }
  }
}

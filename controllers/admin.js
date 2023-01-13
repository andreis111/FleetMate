const moment = require('moment'); // require moment.js library
const Admin = require("../models/Admin");
const Driver = require("../models/Driver");
const Truck = require("../models/Truck");
//WeeklySs and Individuals are both in same collection, but 2 different models. multiple Individual are linked to one WeeklySs
const WeeklySs = require("../models/WeeklySs");
const Individual = require("../models/IndividualTrip");
const Repair = require("../models/Repair");
const CustomOptionTruck = require("../models/CustomOptionTruck");
const cloudinary = require("../middleware/cloudinary");

module.exports = {

  //render the admin main page
  getAdminMainPage: async (req, res) => {
    try {
      // find all drivers that are linked to the currently logged-in admin
      const drivers = await Driver.find({adminId: req.user._id});
      const driverIds = drivers.map(driver => driver._id);
      
      // fetch the recent spreadsheets and repairs that were created by these drivers
      // 3 days ago
      const date = new Date();
      date.setDate(date.getDate() - 3);

      const spreadsheets = await WeeklySs.find({ 
                                                createdBy: {$in: driverIds}, 
                                                createdAt: { $gte: date },
                                                completed:true
                                              })
                                        .populate("createdBy", "userName")
                                        .sort({ createdAt: -1 });
      const repairs = await Repair.find({
                                        createdBy: {$in: driverIds},
                                        createdAt: {$gte: date }
                                      })
                                  .populate("createdBy", "userName")
                                  .sort({ createdAt: -1 });
      console.log(spreadsheets);
      res.render("adminMainPage.ejs", { user: req.user, spreadsheets: spreadsheets, repairs: repairs });
    } catch (err) {
      console.log(err);
      res.redirect("/admin");
    }
  },


  //Admin profile 
  getAdminProfile: async (req, res) => {
    try {
      res.render("profileAdmin.ejs", {user : req.user});
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
      // Check if image file was uploaded
      if (req.file) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.image = result.secure_url;
        req.body.cloudinaryId = result.public_id;
      }
      // Find the individual and update it
      const admin = await Admin.findById(req.user.id);
      // Delete the old image if it exists
      if (admin.cloudinaryId) {
        await cloudinary.uploader.destroy(admin.cloudinaryId);
      }
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

  //delete photo from cloudinary, cloudinaryId and image
  deletePhoto: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      req.body.image = null;
        req.body.cloudinaryId = null;
      if (admin.cloudinaryId) {
        await cloudinary.uploader.destroy(admin.cloudinaryId);
      }
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

  // //Company
  // postCreateCompany: async (req, res) => {
  //   try {
  //     // Upload image to cloudinary
  //     // const result = await cloudinary.uploader.upload(req.file.path);

  //     await Company.create({
  //       name: req.body.name,
  //       address: req.body.address,
  //       vat: req.body.vat,
  //       contactName: req.body.contactName,
  //       contactPhone: req.body.contactPhone,
  //       contactEmail: req.body.contactEmail,
  //       adminId: req.user.id
  //     });
  //     console.log("Company has been added!");
  //     res.redirect("/admin/profile");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  // putEditCompany: async (req, res) => {
  //   //iterate to see if body is empty or not and delete the empty fields
  //   Object.keys(req.body).forEach((key) => {
  //     if (
  //       req.body[key] == null ||
  //       req.body[key] == undefined ||
  //       req.body[key] == ''
  //     ) {
  //       delete req.body[key]
  //     }
  //   })
  //   try {
  //     await Company.findOneAndUpdate(
  //       { adminId: req.user.id },
  //       {
  //         $set: req.body,
  //       }
  //     );
  //     console.log("Company updated");
  //     res.redirect(`/admin/profile`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

                  //TRUCKS controllers:
  
    //get all trucks, find "trucks" created by the admin
    getTrucks: async (req, res) => {
      try {
        // Retrieve the trucks and customoptiontrucks for the logged in user
        const trucks = await Truck.find({ adminId: req.user.id });
        const customoptiontrucks = await CustomOptionTruck.find({ adminId: req.user.id });
    
        // Render the EJS template and pass the trucks and customoptiontrucks as local variables
        res.render("trucksAdmin.ejs", { trucks: trucks, customoptiontrucks: customoptiontrucks, user : req.user });
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
      const driver = await Driver.find({ truckId: req.params.id })
      const customOptions = await CustomOptionTruck.find({ truckId: req.params.id })
      res.render("editTruckAdmin.ejs", { truck: truck, user: req.user , driver: driver, customOptions: customOptions});
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
      });
      try {
        // Update the Truck document
        await Truck.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: req.body,
          }
        );
        console.log("Truck updated");
    
        // Update the CustomOptionTruck documents
        for (const key in req.body) {
          if (key.startsWith('name')) {
            const customOptionId = key.replace('name', '');
            await CustomOptionTruck.findOneAndUpdate(
              { _id: customOptionId },
              {
                $set: {
                  name: req.body[key]
                }
              }
            );
          }
          if (key.startsWith('content')) {
            const customOptionId = key.replace('content', '');
            await CustomOptionTruck.findOneAndUpdate(
              { _id: customOptionId },
              {
                $set: {
                  content: req.body[key]
                }
              }
            );
          }
        }
    
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


      //CUSTOM OPTION TRUCKS
  
  postCustomOption: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await CustomOptionTruck.create({
        truckId: req.params.id,
        adminId: req.user.id,

      });
      console.log("Custom has been added!");
      res.redirect(`/admin/trucks/edit/${req.params.id}`);
    } catch (err) {
      console.log(err);
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
     
     try {
      const trucks = await Truck.find({ adminId: req.user.id })
       const drivers = await Driver.find({ adminId: req.user.id });
       const driversIds = drivers.map(driver => driver.id);
       
       //Used $eq in the find method, stands for 'equal' and is a way to filter
       const weekly = await WeeklySs.find({ createdBy: {$in: driversIds}, completed: {$eq: true} }).sort({ createdAt: 'desc' });
       const individuals = await Individual.find({ createdBy: weekly.id });
   
       res.render("spreadsheetsAdmin.ejs", {weekly: weekly, user : req.user, trucks: trucks, drivers:drivers});
     } catch (err) {
       console.log(err);
     }
  },
   
  filterSpreadsheets: async (req, res) => {
    try {
      const drivers = await Driver.find({ adminId: req.user.id });
      const trucks = await Truck.find({ adminId: req.user.id })
      const driversIds = drivers.map(driver => driver.id);
      const filter = {completed: true}
      
  
      if (req.body.truckId) {
        filter.truckId = req.body.truckId;
      }
      if (req.body.driverId) {
        filter.createdBy = req.body.driverId;
      }
      const filteredSpreadsheets = await WeeklySs.find(filter).sort({ createdAt: 'desc' });
      console.log(filter);
      res.render("spreadsheetsAdmin.ejs", { weekly: filteredSpreadsheets, user: req.user, trucks:trucks, drivers:drivers,  });
    } catch (err) {
      console.log(err);
    }
  },
   
  getIndividualSpreadsheet: async (req, res) => {
    try {
        const week = await WeeklySs.findById(req.params.id);
        const individuals = await Individual.find({ weekId: week.id })
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
      const trucks = await Truck.find({ adminId: req.user.id })
      const repairs = await Repair.find({ createdBy: { $in: driverIds } });
      try {
        res.render("toRepairAdmin.ejs", {repairs: repairs, user : req.user, trucks:trucks});
      } catch (err) {
        console.log(err);
      }
  },
  filterRepairs: async (req, res) => {
    const drivers = await Driver.find({ adminId: req.user.id });
    const driverIds = drivers.map(driver => driver.id);
    
    try {
      
      const trucks = await Truck.find({ adminId: req.user.id })
      const filter = {createdBy: { $in: driverIds }}
      
  
      if (req.body.truckId) {
        filter.truckId = req.body.truckId;
      }
      const filtered= await Repair.find(filter).sort({ createdAt: 'desc' });
      console.log(filter);
      res.render("toRepairAdmin.ejs", { repairs: filtered, user : req.user, trucks:trucks, drivers:drivers,  });
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

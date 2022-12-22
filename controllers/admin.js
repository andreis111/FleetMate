const Driver = require("../models/Driver");
const Truck = require("../models/Truck");

module.exports = {

  getAdminMainPage: async (req, res) => {
    try {
    //   const tasks = await Task.find({completedBy: null}).sort({createdDate: 'desc'}).lean();
    //   const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id }).lean()
      if (req.user.role === 'admin') {
        res.render("adminMainPage.ejs");
      } else {
        res.redirect("/driver" )
      }

    } catch (err) {
      console.log(err);
    }
  },

  getTrucks: async (req, res) => {
    const trucks = await Truck.find({adminId: req.user.id})
      try {
            res.render("trucksAdmin.ejs", {trucks:trucks});
      }catch (err) {
          console.log(err);
      }
  },
  getCreateTruck: async (req, res) => {
    try {
          res.render("createTruck.ejs");
    }catch (err) {
        console.log(err);
    }
  },
  postCreateTruck: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await Truck.create({
        type: req.body.type,
        model: req.body.model,
        plate: req.body.plate,
        chassis: req.body.km,
        driverName: req.body.driverName,
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
  getEditTruck: async (req, res) => {
    try {
      const truck = await Truck.findById(req.params.id);
      res.render("editTruck.ejs", { truck: truck, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
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
};

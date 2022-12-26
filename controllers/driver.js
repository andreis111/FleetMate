const Driver = require("../models/Driver");
const Truck = require("../models/Truck");

module.exports = {

    getDriverMainPage: async (req, res) => {
        try {
            //   const tasks = await Task.find({completedBy: null}).sort({createdDate: 'desc'}).lean();
            //   const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id }).lean()
            res.render("driverMainPage.ejs", { driver: req.user });
            


        } catch (err) {
            console.log(err);
        }
    },
    
}
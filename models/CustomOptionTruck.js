const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const CustomOptionTruckSchema = new mongoose.Schema({
    name:{ type: String,  default: '' },
    content: { type: String,  default: '' },
    truckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck"
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("CustomOptionTruck", CustomOptionTruckSchema);
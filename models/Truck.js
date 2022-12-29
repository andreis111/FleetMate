const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const TruckSchema = new mongoose.Schema({
    type: { type: String },
    model: { type: String },
    plate: { type: String },
    chassis: { type: String },
    km: { type: Number },
    toRepair: { type: String },
    cloudinaryId: { type: String },
    expireVignette: { type: String },
    expireInsurance: { type: String },
    expireCmr: { type: String },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
    
});


module.exports = mongoose.model("Truck", TruckSchema, "trucks");
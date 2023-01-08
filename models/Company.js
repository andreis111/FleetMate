const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    vat: { type: String },
    contactName: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Company", CompanySchema, "companies");
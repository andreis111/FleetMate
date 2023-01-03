const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const WeeklySchema = new mongoose.Schema({
    startDate: { type: String },
    endDate: { type: String },
    truckPlate: { type: String },
    userName: {type: String},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    type: { type: String, default: 'week' },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Spreadsheet", WeeklySchema, "spreadsheets");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const InlineSsSchema = new mongoose.Schema({
    startLoc: { type: String },
    endLoc: { type: String },
    km: { type: String },
    fuel: { type: String },
    otherCosts: { type: String },
    notes: { type: String },
    weekId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklySs"
    }
    
});


module.exports = mongoose.model("Spreadsheet", InlineSsSchema, "spreadsheets");
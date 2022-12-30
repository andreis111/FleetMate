
const mongoose = require("mongoose");

const InlineSsSchema = new mongoose.Schema({
    startLoc: { type: String },
    endLoc: { type: String },
    km: { type: Number, require: true },
    fuel: { type: Number, default: 0},
    otherCosts: { type: Number, default: 0 },
    notes: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    truckPlate: { type: String },
    weekId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklySs"
    },
    type: { type: String, default: 'individual' }
});


module.exports = mongoose.model("Inline", InlineSsSchema, "spreadsheets");
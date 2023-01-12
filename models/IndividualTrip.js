
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
    image: {type: String,require: true,},
    cloudinaryId: {type: String,require: true},
    weekId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklySs"
    },
    type: { type: String, default: 'individual' },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Inline", InlineSsSchema, "spreadsheets");
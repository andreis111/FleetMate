const mongoose = require("mongoose");

const RepairSchema = new mongoose.Schema({
    content: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    truckPlate: {type: String},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
});


module.exports = mongoose.model("Repair", RepairSchema, "repairs");
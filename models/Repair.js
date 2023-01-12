const mongoose = require("mongoose");

const RepairSchema = new mongoose.Schema({
    content: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    truckPlate: { type: String },
    image: {type: String,require: true,},
    cloudinaryId: {type: String,require: true},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    truckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck"
    },
});


module.exports = mongoose.model("Repair", RepairSchema, "repairs");
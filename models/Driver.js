const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
    userName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    idCard: { type: String },
    expireLicense: { type: String },
    expirePermit: { type: String },
    expireAdr: { type: String },
    truckId: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    role: { type: String, required: true, default: 'Driver' },
    createdAt: { type: Date, default: Date.now },
    image: {type: String,require: true, default: null},
    cloudinaryId: {type: String,require: true, default: null}
});

// Password hash middleware.

DriverSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

DriverSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("Driver", DriverSchema, "drivers");
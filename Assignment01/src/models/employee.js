const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  designation: { type: String, required: true },
  salary: { type: Number, required: true, min: [1000, "Salary must be at least 1000"] },
  date_of_joining: { type: Date, default: Date.now },
  department: { type: String, required: true },
  employee_photo: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Export the Employee model
module.exports = mongoose.model("Employee", employeeSchema);

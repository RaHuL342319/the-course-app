const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

// Admin schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User
  },
});

// Purchase schema
const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // reference to Course
  },
});

// Models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = { User, Admin, Course, Purchase };

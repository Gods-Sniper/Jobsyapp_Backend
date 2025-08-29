const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ["jobprovider", "jobseeker"],
      default: "jobprovider",
    },
    nationalId: {
      type: String,
      default: null,
    },
    cv: {
      type: String,
      default: null,
    },
    judiciary: {
      type: String,
      default: null,
    },
    address: [
      {
        city: { type: String },
        locality: { type: String },
      },
    ],
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

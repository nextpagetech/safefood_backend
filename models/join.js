const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    contact_no: {
      type: String,
      required: false,
    },
    cities: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: false,
    },
    modified_by: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const join = mongoose.model("join", joinSchema);
module.exports = join;

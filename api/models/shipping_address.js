const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    Landmark: {
      type: String,
      required: false,
    },
    zipcode: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: false
    },
    modified_by: { 
      type: mongoose.Schema.Types.ObjectId,
       ref: 'User' ,
        required: false}

  },
  {
    timestamps: true,
  }

);

const ShippingAddress = mongoose.model("shipping_address", shippingAddressSchema);

module.exports = ShippingAddress;

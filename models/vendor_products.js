const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const vendorproductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      default: bcrypt.hashSync("12345678"),
    },
    phone: {
      type: String,
      required: false,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false,
        },
        prices: {
          originalPrice: {
            type: Number,
            required: false,
          },
          price: {
            type: Number,
            required: false,
          },
          discount: {
            type: Number,
            required: false,
          },
        },
        title: {
          type: Object,
          required: false,
        },
      }
    ],
    status: {
      type: Number,
      required: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    modified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const Vendorproduct = mongoose.model("Vendorproduct", vendorproductSchema);

module.exports = Vendorproduct;

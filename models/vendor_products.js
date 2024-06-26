const mongoose = require("mongoose");

const vendorproductSchema = new mongoose.Schema(
  {
    vendor_prodcut_id: {
      type: Number,
      required: true,
    },
    vendor_id: {
      type: String,
      required: false,
    },
    product_id: {
      type: String,
      required: false,
    },
    status: {
        type: Number,
        default: "1",
        enum: ["1", "0"],
      },
  },
  {
    timestamps: true,
  }
);

const Vendorproduct = mongoose.model("Vendorproduct", vendorproductSchema);

module.exports = Vendorproduct;

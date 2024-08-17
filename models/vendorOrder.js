const mongoose = require('mongoose');

// Define the schema for user information within a product
const userInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, default: undefined }, // Optional field, can be undefined
  address: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true }
});

// Create a sparse index on the email field
userInfoSchema.index({ email: 1 }, { unique: true, sparse: true });

// Define the schema for products within a vendor
const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Ensure 'Product' is the correct model name
    required: false, // Make sure your application logic handles optional references
  },
  userInfos: [userInfoSchema],
  carts: { type: [Number], required: false }, // Add carts as an array of numbers
  image: [String],
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  sales: { type: Number, required: false },
  price: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  count: { type: Number, required: true },
  displayVendorID: { type: String, required: true },
  displayVendorName: { type: String, required: true },
  displayPrice: { type: Number, required: true },
}, {
  timestamps: true
});

// Define the schema for the Vendor Order
const vendorOrderSchema = new mongoose.Schema({
  products: [productSchema], // Define the array of products
}, {
  timestamps: true
});

// Create and export the VendorOrder model
const VendorOrder = mongoose.model('VendorOrder', vendorOrderSchema);

module.exports = VendorOrder;

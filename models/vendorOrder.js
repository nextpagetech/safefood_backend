// // const mongoose = require('mongoose');

// // // Define the schema for user information within a product
// // const userInfoSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   contact: { type: String, required: true },
// //   email: { type: String, default: undefined }, // Optional field, can be undefined
// //   address: { type: String, required: true },
// //   country: { type: String, required: true },
// //   city: { type: String, required: true }
// // });

// // const orderInfoSchema = new mongoose.Schema({
// //   id: {
// //     type: mongoose.Schema.Types.ObjectId, // Use ObjectId if these are references, or use String if they are simple strings
// //     required: true
// //   }
// // });

// // // Create a sparse index on the email field
// // userInfoSchema.index({ email: 1 }, { unique: true, sparse: true });

// // // Define the schema for products within a vendor
// // const productSchema = new mongoose.Schema({
// //   productId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Product', // Ensure 'Product' is the correct model name
// //     required: false, // Make sure your application logic handles optional references
// //   },
// //   userInfos: [userInfoSchema],
// //   orderIds: [orderInfoSchema],
// //   carts: { type: [Number], required: false }, // Add carts as an array of numbers
// //   image: [String],
// //   title: { type: String, required: false },
// //   quantity: { type: Number, required: false},
// //   status:{ type: String, required: false },
// //   sales: { type: Number, required: false },
// //   price: { type: Number, required: false},
// //   totalQuantity: { type: Number, required:false },
// //   count: { type: Number, required: false },
// //   displayVendorID: { type: String, required: false},
// //   displayVendorName: { type: String, required: false },
// //   displayPrice: { type: Number, required: false },
// // }, {
// //   timestamps: true
// // });

// // // Define the schema for the Vendor Order
// // const vendorOrderSchema = new mongoose.Schema({
// //   products: {type:Object}, // Define the array of products
// // }, {
// //   timestamps: true
// // });

// // // Create and export the VendorOrder model
// // const VendorOrder = mongoose.model('VendorOrder', vendorOrderSchema);

// // module.exports = VendorOrder;


// const mongoose = require('mongoose');

// // Define the schema for user information within a product
// const userInfoSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   contact: { type: String, required: true },
//   email: { type: String, default: undefined }, // Optional field
//   address: { type: String, required: true },
//   country: { type: String, required: true },
//   city: { type: String, required: true }
// });

// // Create a sparse index on the email field
// userInfoSchema.index({ email: 1 }, { unique: true, sparse: true });

// // Define the schema for order information within a product
// const orderInfoSchema = new mongoose.Schema({
//   orderId: {
//     type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
//     required: true
//   }
// });

// // Define the schema for products within a vendor
// const productSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product', // Ensure 'Product' is the correct model name
//     required: false // Optional reference
//   },
//   userInfos: [userInfoSchema],
//   orderIds: [orderInfoSchema], // Array of order information
//   carts: { type: [Number], required: false }, // Array of numbers
//   image: [String], // Array of image URLs
//   title: { type: String, required: false },
//   quantity: { type: Number, required: false },
//   status: { type: String, required: false },
//   sales: { type: Number, required: false },
//   price: { type: Number, required: false },
//   totalQuantity: { type: Number, required: false },
//   count: { type: Number, required: false },
//   displayVendorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false }, // Reference to Vendor model
//   displayVendorName: { type: String, required: false },
//   displayPrice: { type: Number, required: false }
// }, {
//   timestamps: true
// });

// // Define the schema for the Vendor Order
// const vendorOrderSchema = new mongoose.Schema({
//   vendorName: { type: String, required: true },
//   orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   products: [productSchema], // Array of products
// }, {
//   timestamps: true
// });

// // Check if the model already exists and use it, or create a new one
// const VendorOrder = mongoose.models.VendorOrder || mongoose.model('VendorOrder', vendorOrderSchema);

// module.exports = VendorOrder;


const mongoose = require('mongoose');
const vendorOrderSchema = new mongoose.Schema({
  vendorName:{type:String},
  orderId: {type:Object}, 
  products: {type:Object}, 
}, {
  timestamps: true
});


const VendorOrder = mongoose.model('VendorOrder', vendorOrderSchema);

module.exports = VendorOrder;
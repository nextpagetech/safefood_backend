const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Delivered', 'Cancel'], default: 'Pending' },
  // Add other fields as needed
}, { _id: false }); // Set _id: false to prevent creation of additional _id for cart items

const ordernewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoices: { type: Number, required: false },
  cart: [cartItemSchema],
  user_info: {
    name: { type: String, required: false },
    email: { type: String, required: false },
    contact: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  subTotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  discount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  shippingOption: { type: String, required: false },
  paymentMethod: { type: String, required: true },
  cardInfo: { type: Object, required: false },
  status: { type: String, enum: ['Pending', 'Processing', 'Delivered', 'Cancel'], default: 'Pending' },
}, {
  timestamps: true,
});


const Ordernew = mongoose.model(
  "Ordernew",
  ordernewSchema.plugin(AutoIncrement, {
    inc_field: "invoices",
    start_seq: 10000,
  })
);
module.exports = Ordernew;

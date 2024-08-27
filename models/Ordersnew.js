const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoices: {
      type: Number,
      required: false,
    },
    cart: [
      {
        prices: {
          price: Number,
          originalPrice: Number,
          discount: Number,
        },
        image: [String],
        tag: [String],
        status: {
          type: String,
          enum: ["Pending", "Processing", "Delivered", "Cancel"],
          default: "Pending",
        },
        _id: String,
        sku: String,
        barcode: String,
        productId: String,
        title: String,
        category: {
          _id: String,
          name: {
            en: String,
          },
        },
        stock: Number,
        isCombination: Boolean,
        variant: {
          price: Number,
          originalPrice: Number,
          discount: Number,
        },
        price: Number,
        originalPrice: Number,
        quantity: Number,
        itemTotal: Number,
      }
    ],
    user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancel"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update cart items' status to "Processing" before saving the order


orderSchema.plugin(AutoIncrement, {
  inc_field: "invoices",
  start_seq: 10000,
});

const Order = mongoose.model("Ordersnew", orderSchema);
module.exports = Order;

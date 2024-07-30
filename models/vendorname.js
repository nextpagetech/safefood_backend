const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const vendorproductSchema = new mongoose.Schema(
    {
        vendorId: {
            type: String,
            required: false,
        },
        vendorname: {
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
                        required: true,
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
                    required: true,
                },
            }
        ],
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

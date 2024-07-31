const mongoose = require("mongoose");

const vendorproductnameSchema = new mongoose.Schema(
    {
        vendorId: {
            type: String,
            required: false,
        },
        name: {
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

const Vendorproduct = mongoose.model("Vendorproductname", vendorproductnameSchema);

module.exports = Vendorproduct;

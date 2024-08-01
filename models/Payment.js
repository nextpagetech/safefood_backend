const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    AmountToBePaid: { type: Number, required: false },
    amount: { type: Number, required: false },
    date: { type: Date, required: false },
    reference: { type: String, required: false },
    method: { type: String, required: false }, // Added field
    comment: { type: String, required: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', PaymentSchema);



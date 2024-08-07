const express = require('express');
const router = express.Router();
const {
    createPayment,
    getPayments,
    getOrderById,
    getPaymentById,
    updatePayment,
    deletePayment,
    getSingleOrderPayments,
    createPayments,
} = require('../controller/paymentController');

// Create a new payment
router.post('/createpayment', createPayment);

router.get('/getSingleOrderPayments', getSingleOrderPayments);

// Get all payments with optional filtering by date
router.get('/getall', getPayments);

// Get a payment by ID
router.get('/:id', getPaymentById);

// Update a payment by ID
router.put('/:id', updatePayment);

// Delete a payment by ID
router.delete('/:id', deletePayment);


module.exports = router;



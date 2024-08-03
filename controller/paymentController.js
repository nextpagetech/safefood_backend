const Payment = require('../models/Payment');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { AmountToBePaid, amount, date, reference, method, comment } = req.body;
        const newPayment = new Payment({
            AmountToBePaid,
            amount,
            date,
            reference,
            method,
            comment
        });
        const savedPayment = await newPayment.save();
        res.status(201).json({
            AmountToBePaid: savedPayment.AmountToBePaid,
            amount: savedPayment.amount,
            date: savedPayment.date,
            reference: savedPayment.reference,
            method: savedPayment.method,
            comment: savedPayment.comment,
            message: "Payment created successfully!"
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating payment", error: error.message });
    }
};



// Get all payments with optional filtering by date
exports.getPayments = async (req, res) => {
    const { date } = req.query;
    try {
        const filter = date ? { date: new Date(date).toISOString() } : {};
        const payments = await Payment.find(filter);
        res.status(200).json({
            count: payments.length,
            payments: payments.map(payment => ({
                AmountToBePaid: payment.AmountToBePaid,
                amount: payment.amount,
                date: payment.date,
                reference: payment.reference,
                method: payment.method,
                comment: payment.comment,
                _id:payment._id,
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
};

// exports.getSingleOrderPayments = async (req, res) => {
//     const { objectId } = req.body;
//     console.log("req.query:", req.body);
//     console.log("objectId:", objectId);

//     if (!objectId) {
//         return res.status(400).json({ message: "objectId query parameter is required" });
//     }

//     try {
//         const payments = await Payment.find({ objectId }).sort({ _id: -1 });
//         res.send(payments);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching payments", error: error.message });
//     }
// };

exports.getSingleOrderPayments = async (req, res) => {
    // const { objectId } = req.body;
    const objectId = req.query.objectId;
    console.log("req.query:", req.body);
    console.log("objectId:", objectId);

    if (!objectId) {
        return res.status(400).json({ message: "objectId query parameter is required" });
    }

    try {
        const payments = await Payment.find({ objectId }).sort({ _id: -1 });
        res.send(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
};


//get elementby id
exports.getPaymentById = async (req, res) => {
    try {
        const paymentId = req.params.id.trim(); 
        const payment = await Payment.findById(paymentId);
        if (payment) {
            res.status(200).json({
                _id: payment._id,
                AmountToBePaid: payment.AmountToBePaid,
                amount: payment.amount,
                date: payment.date,
                reference: payment.reference,
                method: payment.method,
                comment: payment.comment
            });
        } else {
            res.status(200).json({ message: "Payment not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching payment", error: error.message });
    }
};


//update

exports.updatePayment = async (req, res) => {
    try {
        const paymentId = req.params.id.trim(); 
        const payment = await Payment.findById(paymentId);
        if (payment) {
            // Update with new data
            payment.AmountToBePaid = req.body.AmountToBePaid || payment.AmountToBePaid;
            payment.amount = req.body.amount || payment.amount;
            payment.date = req.body.date || payment.date;
            payment.reference = req.body.reference || payment.reference;
            payment.method = req.body.method || payment.method;
            payment.comment = req.body.comment || payment.comment;
            
            const updatedPayment = await payment.save();
            res.status(200).json({
                AmountToBePaid: updatedPayment.AmountToBePaid,
                amount: updatedPayment.amount,
                date: updatedPayment.date,
                reference: updatedPayment.reference,
                method: updatedPayment.method,
                comment: updatedPayment.comment,
                message: "Payment updated successfully!"
            });
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating payment", error: error.message });
    }
};




//delete 
exports.deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const payment = await Payment.findByIdAndRemove(id);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};















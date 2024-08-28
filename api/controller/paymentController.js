


const Payment = require('../models/Payment');


exports.createPayment = async (req, res) => {
    try {
        const { AmountToBePaid, amount, date, method, comment ,orderId} = req.body;

        // if (amount > AmountToBePaid) {
        //     return res.status(400).json({ message: "Amount cannot be greater than Amount To Be Paid." });
        // }

        // const remainingAmountToBePaid = AmountToBePaid - amount;

        const newPayment = new Payment({
            AmountToBePaid,
            amount,
            date,
            method,
            comment,
            orderId,
        });
        

        const savedPayment = await newPayment.save();
        res.status(201).json({
            AmountToBePaid: savedPayment.AmountToBePaid,
            amount: savedPayment.amount,
            date: savedPayment.date,
            method: savedPayment.method,
            comment: savedPayment.comment,
            orderId: savedPayment.orderId,
            message: "Payment created successfully!"
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(400).json({ message: "Error creating payment", error: error.message });
    }
};



exports.getPayments = async (req, res) => {
    const { date } = req.query;
    console.log("date",date);
    
    try {
        const filter = date ? { date: new Date(date).toISOString() } : {};
        const payments = await Payment.find(filter);
        res.status(200).json({
            count: payments.length,
            payments: payments.map(payment => ({
                AmountToBePaid: payment.AmountToBePaid,
                amount: payment.amount,
                date: payment.date,
                method: payment.method,
                comment: payment.comment,
                _id: payment._id
            }))
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
};


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
                method: payment.method,
                comment: payment.comment
            });
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (error) {
        console.error('Error fetching payment by ID:', error);
        res.status(500).json({ message: "Error fetching payment", error: error.message });
    }
};


exports.updatePayment = async (req, res) => {
    try {
        const paymentId = req.params.id.trim();
        const payment = await Payment.findById(paymentId);
        if (payment) {
            const { AmountToBePaid,amount, date, method, comment } = req.body;

        
            // const remainingAmountToBePaid = payment.AmountToBePaid + payment.amount - amount;

     
            payment.AmountToBePaid = AmountToBePaid || payment.AmountToBePaid;
            payment.amount = amount || payment.amount;
            payment.date = date || payment.date;
            payment.method = method || payment.method;
            payment.comment = comment || payment.comment;

            const updatedPayment = await payment.save();
            res.status(200).json({
                AmountToBePaid: updatedPayment.AmountToBePaid,
                amount: updatedPayment.amount,
                date: updatedPayment.date,
                method: updatedPayment.method,
                comment: updatedPayment.comment,
                message: "Payment updated successfully!"
            });
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: "Error updating payment", error: error.message });
    }
};


exports.deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const payment = await Payment.findByIdAndRemove(id);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSingleOrderPayments = async (req, res) => {
    // const { objectId } = req.body;
    const orderId = req.query.orderId;
    console.log("req.query:", req.body);
    console.log("objectId:", orderId);

    if (!orderId) {
        return res.status(400).json({ message: "objectId query parameter is required" });
    }

    try {
        const payments = await Payment.find({ orderId }).sort({ _id: -1 });
        res.send(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
};











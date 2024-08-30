const express = require("express");
const router = express.Router();
const {
    addOrdernew,
    updateProductStatus,
    getAllOrdersnew,
    getOrdernewById,
    updateOrdernew,
    getOrderAdminInvoiceById,
    getOrderUpdateAdminInvoiceById,
} = require("../controller/ordernewController");




router.post("/getAdminInvoice", getOrderAdminInvoiceById);
router.post("/addOrdernew", addOrdernew);
router.post("/updateProductStatus", updateProductStatus);
router.get("/", getAllOrdersnew);
router.put("/:id", updateOrdernew);
router.get("/getOrdernewById/:id", getOrdernewById);
router.post(`/update`, getOrderUpdateAdminInvoiceById);

module.exports = router;

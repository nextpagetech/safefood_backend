const express = require("express");
const router = express.Router();
const {
    addOrdernew,
    updateProductStatus,
    getAllOrdersnew,
    getOrdernewById,
} = require("../controller/ordernewController");





router.post("/addOrdernew", addOrdernew);
router.post("/updateProductStatus", updateProductStatus);
router.get("/", getAllOrdersnew);
router.get("/getOrdernewById/:id", getOrdernewById);


module.exports = router;

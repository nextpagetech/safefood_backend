const express = require("express");
const router = express.Router();
const {
    vendor_orderadd,
    vendor_orderget,
    // emailSend,
    vendor_ordergetId,
   
    
} = require("../controller/vendorOrderController");

//add a vendor

router.post("/vendor_orderadd", vendor_orderadd);
router.get("/vendor_orderget", vendor_orderget);
router.post("/vendor_ordergetId", vendor_ordergetId);


// router.post("/emailSend", emailSend);




module.exports = router;

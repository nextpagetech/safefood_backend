const express = require("express");
const router = express.Router();
const {
    
    vendor_nameUpdate,
    getVendorUpdateByVendorId,
    
} = require("../controller/vendornameController");
router.post("/vendor_nameUpdate", vendor_nameUpdate);
router.get("/getvendorUpdate", getVendorUpdateByVendorId);




module.exports = router;

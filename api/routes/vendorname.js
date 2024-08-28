const express = require("express");
const router = express.Router();
const {
    
    vendor_nameUpdate,
    getAllvendor_nameUpdate,    
    // getVendorUpateByVendorId,
    getVendorUpdateByVendorId,
    
} = require("../controller/vendornameController");
router.post("/vendor_nameUpdate", vendor_nameUpdate);
router.get("/getAllvendor_nameUpdate", getAllvendor_nameUpdate);
// router.get("/getVendorUpateByVendorId", getVendorUpateByVendorId);
router.get("/getvendorUpdate", getVendorUpdateByVendorId);




module.exports = router;

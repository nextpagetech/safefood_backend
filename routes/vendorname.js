const express = require("express");
const router = express.Router();
const {
    
    vendor_nameUpdate,
    
} = require("../controller/vendornameController");
router.post("/vendor_nameUpdate", vendor_nameUpdate);




module.exports = router;

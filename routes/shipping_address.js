const express = require("express");
const router = express.Router();
const {
    shipping_addressadd,
    getshipping_address,
    getshippingaddressId,
    updateshippingaddress,
    deleteshippingaddress,
} = require("../controller/shipping_address");

//add a vendor
router.post("/shipping_addressadd", shipping_addressadd);

//get all vendor
router.get("/getshipping_address", getshipping_address);

//get a vendor
router.get("/:id", getshippingaddressId);

//update a vendor
router.put("/:id", updateshippingaddress);


router.delete("/:id", deleteshippingaddress);



module.exports = router;

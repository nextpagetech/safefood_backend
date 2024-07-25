const express = require("express");
const router = express.Router();
const {
    vendor_productadd,
    getAllvendor_product,
    getvendor_productId,
    updatevendor_product,
    deletevendor_product,
    vendor_productmapadd,
    vendor_productmapaddupdate,
    vendorDetailsByProductIds,
    getFpoqunatity,
    
} = require("../controller/vendor_products");

//add a vendor

router.post("/vendor_productadd", vendor_productadd);

router.post("/vendor_productmapadd", vendor_productmapadd);
router.post("/getFpoqunatity", getFpoqunatity);
router.post("/vendor_productmapaddupdate", vendor_productmapaddupdate);
router.post("/vendorDetailsByProductIds", vendorDetailsByProductIds);

//get all vendor
router.get("/getAllvendor_product", getAllvendor_product);

//get a vendor
router.get("/:id", getvendor_productId);

//update a vendor
router.put("/:id", updatevendor_product);

router.delete("/:id", deletevendor_product);

module.exports = router;

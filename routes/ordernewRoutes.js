const express = require("express");
const router = express.Router();
const {
    addOrdernew,
    updateProductStatus,
    getAllOrdersnew,
    getOrdernewById,
} = require("../controller/ordernewController");



router.post("/add", addOrdernew);
router.post("/updateProductStatus", updateProductStatus);
router.get("/", getAllOrdersnew);
router.get("/:id", getOrdernewById);


module.exports = router;

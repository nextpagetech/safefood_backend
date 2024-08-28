
const express = require("express");
const router = express.Router();
const {
    emailSend,
   
} = require("../controller/contactController");

router.post("/emailSend", emailSend);

module.exports = router;


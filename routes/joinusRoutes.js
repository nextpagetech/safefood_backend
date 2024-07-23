
const express = require("express");
const router = express.Router();

const { emailSend } = require("../controller/joinusController");

router.post("/emailSend", emailSend);

module.exports = router;




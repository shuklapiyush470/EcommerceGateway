const express = require("express");
const router = express.Router();

const { makePayment } = require("../controllers/stripepayment");

router.post("/stripe/checkout", makePayment);

module.exports = router;

const express = require("express");
const router = express.Router();

const { isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/paypalpayment");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

router.get("/paypal/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
	"/paypal/payment/:userId",
	isSignedIn,
	isAuthenticated,
	processPayment
);

module.exports = router;

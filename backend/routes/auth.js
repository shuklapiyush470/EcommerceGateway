const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const { signup, signin, signout, isSignedIn } = require("../controllers/auth");

router.post(
	"/signup",
	[
		check("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters"),
		check("name")
			.isLength({ min: 3 })
			.withMessage("Name should be atleast 3 characters"),
		check("email").isEmail().withMessage("Enter a valid E-Mail")
	],
	signup
);

router.post(
	"/signin",
	[
		check("email").isEmail().withMessage("Enter a valid E-Mail"),
		check("password")
			.isLength({ min: 1 })
			.withMessage("Password cannot be empty")
	],
	signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
	res.json(req.auth);
});

module.exports = router;

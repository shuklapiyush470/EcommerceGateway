Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@shuklapiyush470 
dineshsr
/
lco-mern-bootcamp
1
00
Code
Issues
2
Pull requests
3
Actions
Projects
1
Wiki
Security
Insights
lco-mern-bootcamp/projbackend/controllers/auth.js /

Dinesh Rajendran [FEATURE]: Pushed all the codes done.
Latest commit 2da9233 on 7 Dec 2020
 History
 0 contributors
112 lines (102 sloc)  2.32 KB
  
const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const { SECRET } = require("../config/serverConfig");

exports.signup = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg
		});
	}
	const newUser = new User(req.body);
	newUser.save((err, user) => {
		if (err) {
			if (err.code === 11000) {
				return res.status(400).json({
					error: "Account with this Email ID already exists"
				});
			} else {
				return res.status(400).json({
					error: err
				});
			}
		}
		res.status(200).json({
			name: user.name,
			email: user.email,
			id: user._id
		});
	});
};

exports.signin = (req, res) => {
	const { email, password } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg
		});
	}

	User.findOne({ email }, (err, user) => {
		if (err) {
			return res.status(400).json({
				message: err
			});
		}
		if (!user) {
			return res.status(400).json({
				message: "User doesn't exist"
			});
		}
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "Email or Password don't match"
			});
		}
		//create token
		const token = jwt.sign({ _id: user._id }, SECRET);
		//put token
		res.cookie("token", token, {
			expire: 60000 + Date.now(),
			sameSite: true
		});

		const { _id, name, email, role } = user;

		res.status(200).json({
			token,
			user: { _id, name, email, role }
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.status(200).json({
		message: "Signed out"
	});
};

//protected routes
exports.isSignedIn = expressJwt({
	secret: SECRET,
	userProperty: "auth",
	algorithms: ["HS256"]
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
	console.log("PROFILE : " + req.profile);
	console.log("AUTH : " + req.auth._id);
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({
			error: "Access Denied"
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: "Not authorized to perform this operation"
		});
	}
	next();
};
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete

const User = require("../models/user");
const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
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
		req.profile = user;
		next();
	});
};

exports.getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.createdAt = undefined;
	return res.json(req.profile);
};

exports.updateUser = (req, res) => {
	User.findByIdAndUpdate(
		{
			_id: req.profile._id
		},
		{
			$set: req.body
		},
		{
			new: true,
			useFindAndModify: false
		},
		(err, user) => {
			if (err) {
				return res.status(400).json({
					message: err
				});
			}
			if (!user) {
				return res.status(400).json({
					message: "Not authorized to update this user"
				});
			}
			user.salt = undefined;
			user.encry_password = undefined;
			user.createdAt = undefined;
			return res.status(200).json(user);
		}
	);
};

exports.userPurchaseList = (req, res) => {
	Order.find({ user: req.profile._id })
		.populate("user", "_id name")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: err
				});
			}
			if (!orders) {
				return res.status(400).json({
					error: "No categories found!"
				});
			}
			res.status(200).json(orders);
		});
};

exports.pushOrderInPurchaseList = (req, res, next) => {
	let purchases = [];
	req.body.order.products.forEach((product) => {
		purchases.push({
			_id: product._id,
			name: product.name,
			description: product.description,
			category: product.category,
			quantity: product.quantity,
			amount: req.body.order.amount,
			transaction_id: req.body.order.transaction_id
		});
	});

	//store order in DB
	User.findOneAndUpdate(
		{ _id: req.profile._id },
		{
			$push: { purchases: purchases }
		},
		{ new: true },
		(err, orderList) => {
			if (err) {
				return res.status(400).json({
					error: err
				});
			}
			next();
		}
	);
};

const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
	Order.findById(id)
		.populate("products.product", "name price")
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: "NO order found in DB"
				});
			}
			req.order = order;
			next();
		});
};

exports.createOrder = (req, res) => {
	req.body.order.user = req.profile;
	const order = new Order(req.body.order);
	order.save((err, order) => {
		if (err) {
			return res.status(400).json({
				message: err
			});
		}
		res.status(200).json(order);
	});
};

exports.getAllOrders = (req, res) => {
	Order.find()
		.populate("user", "_id name")
		.exec((req, orders) => {
			if (err) {
				return res.status(400).json({
					message: "No orders found"
				});
			}
			res.json(orders);
		});
};

exports.updateStatus = (req, res) => {
	Order.update(
		{ _id: req.body.orderId },
		{ $set: { status: req.body.status } },
		(err, order) => {
			if (err) {
				return res.status(400).json({
					message: "Cannot update the order"
				});
			}
			res.json(order);
		}
	);
};
exports.getOrderStatus = (req, res) => {
	res.json(Order.schema.path("status").enumValues);
};

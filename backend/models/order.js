const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;

const productCartSchema = new Schema({
	product: {
		type: ObjectId,
		ref: "Product",
		required: true
	},
	name: String,
	count: Number
});

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema(
	{
		products: [productCartSchema],
		transaction_id: {},
		amount: {
			type: Number
		},
		address: String,
		status: {
			type: String,
			default: "Recieved",
			enum: [
				"Cancelled",
				"Delivered",
				"Shipped",
				"Processing",
				"Recieved"
			]
		},
		updated: Date,
		user: {
			type: ObjectId,
			ref: "User",
			required: true
		}
	},
	{ timestamps: true, collection: "Order" }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };

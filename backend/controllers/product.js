const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
		.populate("category")
		.exec((err, product) => {
			if (err) {
				return res.status(400).json({
					message: err
				});
			}
			if (!product) {
				return res.status(400).json({
					message: "Product doesn't exist"
				});
			}
			req.product = product;
			next();
		});
};

exports.createProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				message: "Error in the uploaded files"
			});
		}

		//Destructuring fields
		let { name, description, price, variant, category, stock } = fields;

		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
				err: "Please provide all the required fields"
			});
		}

		let product = new Product(fields);

		//handle files
		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					message: "File size is too big"
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}

		//Save to DB
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					message: "Adding product failed"
				});
			}
			res.status(200).json(product);
		});
	});
};

exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

//Get photo middleware
exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		res.set("Content-Type", req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.deleteProduct = (req, res) => {
	let product = req.product;
	product.remove((err, deletedProd) => {
		if (err) {
			return res.status(400).json({
				message: "Deleting product failed"
			});
		}
		res.status(200).json({
			message: `${deletedProd.name} successfully deleted!`
		});
	});
};

exports.updateProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				message: "Error in the uploaded files"
			});
		}

		//Updation code from UI
		let product = req.product;
		product = _.extend(product, fields);

		//handle files
		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					message: "File size is too big"
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}

		//Save to DB
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					message: "Updating product failed"
				});
			}
			res.status(200).json(product);
		});
	});
};

exports.getAllProducts = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 12;
	let sortBy = req.query.sort ? req.query.sort : "_id";

	Product.find()
		.select("-photo")
		.populate("category")
		.sort([[sortBy, "asc"]])
		.limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: err
				});
			}
			res.status(200).json(products);
		});
};

//Update Stocks middleware
exports.updateStock = (req, res, next) => {
	let operations = req.body.order.products.map((prod) => {
		return {
			updateOne: {
				filter: { _id: prod._id },
				update: {
					$increment: { stock: -prod.count, sold: +prod.count }
				}
			}
		};
	});

	Product.bulkWrite(operations, {}, (err, products) => {
		if (err) {
			return res.status(400).json({
				error: "Bulk operation failed"
			});
		}
		next();
	});
};

//Get all categories for product
exports.getProductCategories = (req, res) => {
	Product.distinct("category", {}, (err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Getting product categories failed"
			});
		}
		res.status(200).json(category);
	});
};

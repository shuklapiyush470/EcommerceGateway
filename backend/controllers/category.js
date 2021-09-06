const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, categorys) => {
		if (err) {
			return res.status(400).json({
				message: err
			});
		}
		if (!categorys) {
			return res.status(400).json({
				message: "Category doesn't exist"
			});
		}
		req.category = categorys;
		next();
	});
};

exports.createCategory = (req, res) => {
	const newCategory = new Category(req.body);
	console.log(newCategory);
	newCategory.save((err, category) => {
		if (err) {
			if (err.code === 11000) {
				return res.status(400).json({
					error: `${newCategory.name} already exists`
				});
			} else {
				return res.status(400).json({
					error: "Internal error occured"
				});
			}
		}
		res.status(200).json(category);
	});
};

exports.getCategory = (req, res) => {
	return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
	Category.find().exec((err, categories) => {
		if (err) {
			return res.status(400).json({
				error: err
			});
		}
		res.status(200).json(categories);
	});
};

exports.updateCategory = (req, res) => {
	const category = req.category;
	category.name = req.body.name;
	category.save((err, updatedCategory) => {
		if (err) {
			return res.status(400).json({
				error: err
			});
		}
		res.status(200).json(updatedCategory);
	});
};

exports.removeCategory = (req, res) => {
	const category = req.category;

	category.remove((err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to delete category"
			});
		}
		res.status(200).json({
			message: `${category.name} Category successfully deleted!`
		});
	});
};

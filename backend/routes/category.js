const express = require("express");

const router = express.Router();

const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const {
	getCategoryById,
	getCategory,
	getAllCategory,
	createCategory,
	updateCategory,
	removeCategory
} = require("../controllers/category");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//GET routes
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//Create routes
router.post(
	"/category/create/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createCategory
);

//UPDATE routes
router.put(
	"/category/update/:categoryId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateCategory
);

//Delete route
router.delete(
	"/category/delete/:categoryId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	removeCategory
);
module.exports = router;

const express = require("express");
const router = express.Router();

const {
	getProductById,
	createProduct,
	getProduct,
	getAllProducts,
	getProductCategories,
	photo,
	deleteProduct,
	updateProduct
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("productId", getProductById);

//Get single product
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// Create Product
router.post(
	"/product/create/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createProduct
);

//Update Product
router.put(
	"/product/:productId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateProduct
);

//Delete Product
router.delete(
	"/product/:productId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	deleteProduct
);

//Listing all products
router.get("/products", getAllProducts);

router.get("/products/categories", getProductCategories);

module.exports = router;

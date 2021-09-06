const express = require("express");
const router = express.Router();

const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const {
	getOrderById,
	createOrder,
	getAllOrders,
	getOrderStatus,
	updateStatus
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//Params
router.param("userId", getUserById);
router.param("userId", getOrderById);

//Create Order
router.post(
	"/order/create/:userId",
	isSignedIn,
	isAuthenticated,
	pushOrderInPurchaseList,
	updateStock,
	createOrder
);

//Get all Orders for admin
router.get(
	"/order/all/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getOrderStatus
);

//Get Status of order
router.get(
	"/order/status/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getOrderStatus
);

//Update order
router.put(
	"/order/:orderId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateStatus
);
module.exports = router;

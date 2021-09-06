const express = require("express");

const router = express.Router();

const {
    getUserById,
    getUser,
    updateUser,
    userPurchaseList
} = require("../controllers/user");
const { isAuthenticated, isSignedIn } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/updateUser/:userId", isSignedIn, isAuthenticated, updateUser);

//User Order
router.get(
    "/user/orders/:userId",
    isSignedIn,
    isAuthenticated,
    userPurchaseList
);

module.exports = router;

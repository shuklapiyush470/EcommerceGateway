require("dotenv").config();

module.exports = {
	PORT: process.env.PORT,
	DATABASE: process.env.DATABASE,
	NODE_ENV: process.env.NODE_ENV, //change to production when deploying
	SECRET: process.env.SECRET,
	STRIPE_KEY: process.env.STRIPE_SECRET_KEY
};

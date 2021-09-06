const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { PORT, DATABASE, NODE_ENV } = require("./config/serverConfig");
const IN_PROD = NODE_ENV === "production";
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");
const paypalRoutes = require("./routes/paypalpayment");

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paypalRoutes);

const startApp = async () => {
	try {
		await mongoose
			.connect(DATABASE, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true
			})
			.then(() => {
				console.log("Connected to database");
			})
			.catch(() => {
				console.log("Error in connection");
			});

		app.listen(PORT, () => {
			console.log("Server started and listening on port " + PORT);
		});
	} catch (err) {
		console.log(err);
	}
};
startApp();

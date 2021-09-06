const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: "ktqt3dgwdpm3yq8x",
	publicKey: "v7k4k54vcmyfpv5c",
	privateKey: "4d771f87f1b15875aceb4e22552b64a8"
});

exports.getToken = (req, res) => {
	gateway.clientToken.generate({}, (err, response) => {
		if (err) {
			res.status(500).json(err);
		} else {
			res.send(response);
		}
	});
};

exports.processPayment = (req, res) => {
	let nonceFromTheClient = req.body.paymentMethodNonce;
	let amountFromTheClient = req.body.amount;
	gateway.transaction.sale(
		{
			amount: amountFromTheClient,
			paymentMethodNonce: nonceFromTheClient,
			options: {
				submitForSettlement: true
			}
		},
		(err, result) => {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(result);
			}
		}
	);
};

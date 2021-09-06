const { STRIPE_KEY } = require("../config/serverConfig");
const stripe = require("stripe")(
	"sk_test_51HWLlcIcnpmYAi2tHwMca759E9NbDtnFlyV2UYGgoQmhUYMdGUzgmOH0sVdicvmrJ1tJFaB6uiRKJXQSiY2t7f4t00IewN6Nbh"
);
const { v4: uuid } = require("uuid");

exports.makePayment = (req, res) => {
	const { token, finalAmount } = req.body;
	console.log(req.body);

	const idempotencyKey = uuid();

	return stripe.customers
		.create({
			email: token.email,
			source: token.id
		})
		.then((customer) => {
			stripe.charges
				.create(
					{
						amount: finalAmount * 100,
						currency: "inr",
						customer: customer.id,
						receipt_email: token.email,
						description: "Test Account",
						shipping: {
							name: token.card.name,
							address: {
								line1: token.card.address_line1,
								line2: token.card.address_line2,
								city: token.card.address_city,
								country: token.card.address_country,
								postal_code: token.card.address_zip
							}
						}
					},
					{ idempotencyKey }
				)
				.then((result) => res.status(200).json(result))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

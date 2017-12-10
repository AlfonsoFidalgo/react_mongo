const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.post("/api/stripe", requireLogin, (req, res) => {
    stripe.charges
      .create({
        amount: 500,
        currency: "usd",
        description: "pay 5usd for credits",
        source: req.body.id
      })
      .then(charge => {
        req.user.credits += 5;
        const user = req.user.save().then(user => {
          res.send(user);
        });
      });
  });
};

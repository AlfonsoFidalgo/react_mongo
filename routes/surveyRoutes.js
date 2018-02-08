const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thanks for the feedback!");
  });
  app.post("/api/surveys", requireLogin, requireCredits, (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    app.post("/api/surveys/webhooks", (req, res) => {
      console.log(req.body);
      res.send({ hello: "there" });
    });

    //send email
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      mailer.send();

      survey.save();
      req.user.credits -= 1;
      const user = req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};

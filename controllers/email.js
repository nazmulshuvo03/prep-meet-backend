const { sendWelcomeEmail } = require("../helpers/emailWelcome");
const asyncWrapper = require("../middlewares/async");

const testEmail = asyncWrapper(async (req, res) => {
  const { type } = req.params;
  const props = req.body;

  if (type === "welcome") {
    sendWelcomeEmail(props);
    res.success(`Email sent to ${props.receiver}`);
  } else res.fail("Email type is not provided");
});

module.exports = {
  testEmail,
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const asyncWrapper = require("../middlewares/async");
const { User } = require("../models/user");

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
};

const signupUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    res.send("User already exists");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const model = {
      email,
      password: hashedPassword,
    };
    const user = await User.create(model);
    const token = createToken(user.id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
    res.send({ userId: user.id });
  } catch (err) {
    console.log("Error in register: ", err);
    res.send(err);
  }
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createToken(user.id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.send({ userId: user.id });
      } else {
        throw Error("Incorrect password");
      }
    } else {
      throw Error("Incorrect email");
    }
  } catch (err) {
    console.log("Error in login: ", err);
    res.send(err);
  }
});

const logoutUser = asyncWrapper(async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("user", null, { maxAge: 1 });
    res.send("User logged out");
  } catch (error) {
    console.log("Error in logout: ", error);
    res.send(error);
  }
});

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};

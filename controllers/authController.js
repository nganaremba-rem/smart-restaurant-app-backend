const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

exports.authenticate = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded_token.id).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Unauthenticated user");
    }
  } else {
    res.status(401);
    throw new Error("Unauthenticated user");
  }
});

exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;
  if (!firstName || !lastName || !email || !password || !role) {
    res.status(400);
    throw new Error("Please enter all details");
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("Account already exists. Please SignIn");
  }

  const newUser = await User.create({
    firstName,
    lastName,
    role,
    email,
    password,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to sign up");
  }
});

exports.signin = asyncHandler(async (req, res) => {
  console.log(req.query);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

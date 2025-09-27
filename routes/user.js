const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = Router();
const { User } = require("../db");
const { JWT_USER_SECRET } = require("../config");
const { authUserMiddleware } = require("../middlewares/user");
const { requiredBodySchema, requireSigninBody } = require("../validators/user");

userRouter.post("/signup", async (req, res) => {
  // console.log(req.body);

  try {
    const requiredBody = requiredBodySchema.safeParse(req.body);

    if (!requiredBody.success) {
      return res.status(400).json({
        message: "Invalid Data",
        error: requiredBody.error,
      });
    }
    const { email, password, firstName, lastName } = requiredBody.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // HASHED PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    res.json({
      message: "User Signed up successfully!",
    });
  } catch (error) {
    res.json({
      message: "Something went Wrong please try again",
      error: error,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const bodyParsed = requireSigninBody.safeParse(req.body);
    console.log(bodyParsed);
    if (!bodyParsed.success) {
      res.status(400).json({
        message: "Invalid body data",
        error: bodyParsed.error,
      });
    }

    const { email, password } = bodyParsed.data;

    // find in db
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email " });
    }

    // compare password
    const passwordCheck = await bcrypt.compare(password, user.password);
    console.log(passwordCheck);
    if (!passwordCheck) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id.toString() }, JWT_USER_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went Wrong",
      error: error,
    });
  }
});

userRouter.get("/purchases", authUserMiddleware, (req, res) => {
  const userId = req.userId;
  res.json({
    message: "Purchased course",
    userId: userId,
  });
});

module.exports = {
  userRouter: userRouter,
};

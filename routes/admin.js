const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");

const adminRouter = Router();
const {
  requiredBodySchema,
  requireSigninBody,
} = require("../validators/admin");

adminRouter.post("/signup", async (req, res) => {
  // Zod validation for Input
  try {
    const validatedReq = requiredBodySchema.safeParse(req.body);

    if (!validatedReq.success) {
      return res.status(400).json({
        message: "Invalid Data",
        error: requiredBody.error,
      });
    }

    const { email, password, firstName, lastName } = validatedReq.data;

    const user = await Admin.findOne({
      email,
    });
    if (user) {
      res.status(403).json({
        message: "Admin already exists with this mail.",
      });
    }
    // hashed password before storing in db
    const hashedPassword = await bcrypt.hash(password, 12);

    // Storing into db
    await Admin.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    res.json({
      message: "Admin Signed Up successfully",
      data: {
        email: email,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
});

adminRouter.post("/sigin", async (req, res) => {
  try {
    const validatedInput = requireSigninBody.safeParse(req.body);

    if (!validatedInput.success) {
      res.status(403).json({
        message: "invalid Input",
      });
    }
    const { email, password } = validatedInput.data;

    // find in db
    const user = await Admin.findOne({ email });

    if (!user) {
      res.json({
        message: "Invalid email Id",
      });
    }

    //compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.json({
        message: "Password is incorrect",
      });
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
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong, Please try again",
      error: err,
    });
  }
});

adminRouter.post("/course", (req, res) => {
  res.json({
    message: "Admin can create course",
  });
});

adminRouter.put("/course", (req, res) => {
  res.json({
    message: "Admin can Change course",
  });
});

adminRouter.get("/course/bulk", (req, res) => {
  res.json({
    message: "Admin can get all course",
  });
});

module.exports = {
  adminRouter: adminRouter,
};

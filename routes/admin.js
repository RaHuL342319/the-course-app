const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminRouter = Router();
const { Course, Admin } = require("../db");
const {
  requiredBodySchema,
  requireSigninBody,
} = require("../validators/admin");
const { JWT_ADMIN_SECRET } = require("../config");
const { authAdminMiddleware } = require("../middlewares/admin");

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

adminRouter.post("/signin", async (req, res) => {
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
    console.log("hooooo");
    // Generate JWT token
    const token = jwt.sign({ id: user._id.toString() }, JWT_ADMIN_SECRET, {
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
    console.log(err);
    res.status(500).json({
      message: "Something went wrong, Please try again",
      error: err,
    });
  }
});

adminRouter.post("/course", authAdminMiddleware, async (req, res) => {
  // create a course by creator or admin
  const creatorId = req.adminId;
  try {
    // zod validation
    const courseBody = z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(5).max(200),
      price: z.number(),
      imageUrl: z.string(),
    });

    const validateCourseBody = courseBody.safeParse(req.body);

    if (!validateCourseBody.success) {
      return res.status(400).json({
        message: "Provide valid course data!",
        error: validateCourseBody.error,
      });
    }
    const { title, description, price, imageUrl } = validateCourseBody.data;

    const course = await Course.create({
      title,
      description,
      price,
      imageUrl,
      creatorId,
    });
    res.status(200).json({
      message: "Your Course added successfully",
      data: {
        title,
        description,
        price,
        imageUrl,
        creatorId,
        courseId: course._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
});

adminRouter.put("/course", authAdminMiddleware, async (req, res) => {
  try {
    const creatorId = req.adminId;

    // zod validation schema
    const courseBody = z.object({
      courseId: z.string(),
      title: z.string().min(5).max(100),
      description: z.string().min(5).max(200),
      price: z.number(),
      imageUrl: z.string().url(),
    });

    const validateCourseBody = courseBody.safeParse(req.body);

    if (!validateCourseBody.success) {
      return res.status(400).json({
        message: "Provide valid course data!",
        errors: validateCourseBody.error.errors,
      });
    }

    const { courseId, title, description, price, imageUrl } =
      validateCourseBody.data;

    // find and update in one go
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: creatorId },
      { title, description, price, imageUrl },
      { new: true } // return updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({
        message: "Course not found or you are not the creator",
      });
    }

    res.status(200).json({
      message: "Course updated successfully ✅",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
});

adminRouter.get("/course/bulk", authAdminMiddleware, async (req, res) => {
  try {
    const creatorId = req.adminId;
    console.log(creatorId);
    const allCoursesByCreator = await Course.find({ creatorId });
    res.status(200).json({
      message: "success",
      data: {
        courses: allCoursesByCreator,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};

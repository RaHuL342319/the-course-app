const { Router } = require("express");
const { authUserMiddleware } = require("../middlewares/user");
const { Course, Purchase } = require("../db"); // import models

const courseRouter = Router();

// Preview all courses
courseRouter.get("/preview", async (req, res) => {
  try {
    const allCourses = await Course.find({});
    res.status(200).json({
      message: "success",
      data: { courses: allCourses },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

// Purchase a course
courseRouter.post("/purchase", authUserMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // set in authUserMiddleware
    const { courseId } = req.body;

    // check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // save purchase
    await Purchase.create({ userId, courseId });

    res.status(200).json({
      message: "Course purchased successfully",
      data: { courseId },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

module.exports = { courseRouter };

const { Router } = require("express");

const courseRouter = Router();

courseRouter.get("/preview", (req, res) => {
  res.json({
    message: "Courses preview endpoint",
  });
});

courseRouter.post("/purchase", (req, res) => {
  res.json({
    message: "purchase course endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter,
};

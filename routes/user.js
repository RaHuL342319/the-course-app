const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  res.json({
    message: "User signup endpoint",
  });
});

userRouter.post("/sigin", (req, res) => {});

userRouter.get("/purchases", (req, res) => {});

module.exports = {
  userRouter: userRouter,
};

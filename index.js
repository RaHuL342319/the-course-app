require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
const port = 3000;

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
  // dotenv thing
  await mongoose.connect(process.env.MONGO_URL);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

main();

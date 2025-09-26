const express = require("express");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const app = express();
const port = 3000;

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

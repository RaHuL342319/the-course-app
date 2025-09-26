const express = require("express");

const app = express();
const port = 3000;

// routes
app.post("/user/signup", (req, res) => {});

app.post("/user/sigin", (req, res) => {});

app.get("/user/purchases", (req, res) => {});

app.get("/courses", (req, res) => {});

app.post("/course/purchase", (req, res) => {});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

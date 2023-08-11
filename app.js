const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const app = express();

app.use(
  cors({
    origin: process.env.REACT_APP_URL,
  })
);
app.use(express.json());
app.use("/api/v1/users", userRouter);

module.exports = app;

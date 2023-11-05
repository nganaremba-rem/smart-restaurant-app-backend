const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const yaml = require("yamljs");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = yaml.load("./api.yaml");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routes/userRoutes");
const menuItemRouter = require("./routes/menuItemRoutes");
const orderRouter = require("./routes/orderRoutes");
const paymentRouter = require("./payment");
const errorController = require("./controllers/errorController");
const ratingRouter = require("./routes/ratingRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const app = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 150, // limit each IP to 150 requests per windowMs
  message: "Too many requests",
});

app.use(limiter);

app.use(cors());
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against site script xss (e.g. removes HTML code from data)
app.use(xss());

// Basic security headers
app.use(helmet());

app.use(
  "/restaurant/api/v1/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc)
);
app.use("/restaurant/api/v1/users", userRouter);
app.use("/restaurant/api/v1/menuItems", menuItemRouter);
app.use("/restaurant/api/v1/orders", orderRouter);
app.use("/restaurant/api/v1/payment", paymentRouter);
app.use("/restaurant/api/v1/rating", ratingRouter);
app.use("/restaurant/api/v1/notifications", notificationRouter);
app.use(errorController);
module.exports = app;

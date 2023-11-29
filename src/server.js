const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

//Routes
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Helmet middleware for securing HTTP headers
app.use(helmet());

// Rate Limiting middleware to protect against brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration for better security
const corsOptions = {
  origin: process.env.FRONTEND_BASE_URL, // replace with your frontend app URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Routes
app.use("/user", userRoutes);
app.use("/bus", busRoutes);
app.use("/route", routeRoutes);
app.use("/ticket", ticketRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

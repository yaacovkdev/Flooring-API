// Import required modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");

// Create an instance of the express app
const app = express();
const imageRoutes = require(path.join(__dirname, "./routes/imageroutes"));
const textRoutes = require(path.join(__dirname, "./routes/textroutes"));
const projectRoutes = require(path.join(__dirname, "./routes/projectroutes"));
const adminRoutes = require(path.join(__dirname, "./routes/adminroutes"));

// Define the port
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000", // Your React app's origin
  credentials: true, // Allow credentials (cookies) to be sent
};

app.use(cors(corsOptions));

app.use("/images", imageRoutes);
app.use("/texts", textRoutes);
app.use("/projects", projectRoutes);
app.use("/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("API for Flooring!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Import required modules
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const path = require('path');

// Create an instance of the express app
const app = express();
const imageRoutes = require("./routes/imageroutes");
const textRoutes = require("./routes/textroutes");
const projectRoutes = require("./routes/projectroutes");

// Define the port
const PORT = process.env.PORT || 3000;

// const imageRoutes = require("./routes/imageroutes");
// console.log(imageRoutes);


app.use(cors());
app.use(express.json());

app.use("/images", imageRoutes);
app.use("/texts", textRoutes);
app.use("/projects", projectRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
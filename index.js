const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
  
const DB_URL = process.env.DB_URL;

mongoose.connect("mongodb+srv://kalidindidhrutika:1234KALIDINDI@cluster0.jerf3wp.mongodb.net/").then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


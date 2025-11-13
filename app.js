import express from "express";
import dotenv from "dotenv";
import conectDB from "./config/mongodb.js";

// config
dotenv.config();
conectDB();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome To Blog Api" });
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

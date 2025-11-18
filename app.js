import express from "express";
import dotenv from "dotenv";
import conectDB from "./config/mongodb.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import cookieParser from "cookie-parser";
import commentRoute from "./routes/commentRoute.js";
import cors from 'cors' // to connect frontend and backend

// config
dotenv.config();
conectDB();

const PORT = process.env.PORT;

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome To Blog Api" });
});
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

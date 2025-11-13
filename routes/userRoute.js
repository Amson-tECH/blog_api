import express from "express";
import { registerUser } from "../controllers/userController.js";

const userRoute = express.Router();

// routes
userRoute.post("/signup", registerUser);
// userRoute.post("/login");

export default userRoute;

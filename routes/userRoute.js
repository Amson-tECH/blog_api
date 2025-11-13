import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRoute = express.Router();

// routes
userRoute.post("/signup", registerUser);
userRoute.post("/signin", loginUser);

export default userRoute;

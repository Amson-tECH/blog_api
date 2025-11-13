import express from "express";
import { loginUser, logout, registerUser } from "../controllers/userController.js";

const userRoute = express.Router();

// routes
userRoute.post("/signup", registerUser);
userRoute.post("/signin", loginUser);
userRoute.get("/signout", logout)

export default userRoute;

import express from "express";
import {
  currentUser,
  loginUser,
  logout,
  registerUser,
} from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

// routes
userRoute.post("/signup", registerUser);
userRoute.post("/signin", loginUser);
userRoute.get("/signout", logout);
userRoute.get("/me", authUser, currentUser);

export default userRoute;

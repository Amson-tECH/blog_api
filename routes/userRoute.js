import express from "express";
import {
  currentUser,
  loginUser,
  logout,
  registerUser,
  updateProfile,
} from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

// routes
userRoute.post("/signup", registerUser);
userRoute.post("/signin", loginUser);
userRoute.get("/signout", logout);
userRoute.get("/me", authUser, currentUser);
userRoute.put("/update/:id", authUser, updateProfile);


export default userRoute;

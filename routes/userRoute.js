import express from "express";

const userRoute = express.Router();

// routes
userRoute.post("/register");
userRoute.post("/login");

export default userRoute;

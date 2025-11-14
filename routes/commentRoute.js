import express from "express";
import { authUser } from "../middleware/authMiddleware.js";
import { addComment, getComments } from "../controllers/commentController.js";

const commentRoute = express.Router();

commentRoute.post("/:id", authUser, addComment);
commentRoute.get("/all/:id",getComments)

export default commentRoute;

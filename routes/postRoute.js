import express from "express";
import { createPost, getPosts, getPost, updatePost, deletePost } from "../controllers/postController.js";
import { authUser } from "../middleware/authMiddleware.js";

const  postRoute = express.Router();

postRoute.post("/create",authUser, createPost)
postRoute.get("/allposts", getPosts)


export default postRoute;

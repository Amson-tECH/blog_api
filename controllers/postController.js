import Post from "../models/postModel.js";
import user from "../models/userModel.js";

//create a post
export const createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.create({
      author: req.user.id,
      title,
      content,
    });
    res.status(201).json({success: true, message: post});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};

// get a post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update a post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update" });
    }
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }
    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

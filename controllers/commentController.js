import comment from "../models/commentModel.js";
import post from "../models/postModel.js";

// add comment
const addComment = async (req, res) => {
  try {
    const content = await comment.create({
      comment: req.body.comment,
      post: req.params.id,
      author: req.user._id,
    });

    const populatedComment = await content.populate("author", "name username");

    res.json({ success: true, content: populatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server down" });
  }
};


// get comments for a post
const getComments = async (req, res) => {
  try {

    // const findPost = await post.findById(req.params.postId)
    // if(!findPost){
    //     res.status(401).json({success: false, message: "No post found"})
    // }

    const comments = await comment.find({ post: req.params.postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err)
  }
};

export { addComment , getComments};

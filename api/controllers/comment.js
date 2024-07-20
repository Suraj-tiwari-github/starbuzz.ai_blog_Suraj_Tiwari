const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");

const createComment = async (req, res, next) => {
  try {
    const {content, id, userId}=req.body;
      
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
     const comment = new Comment({
       body: content,
       author: userId,
     });

await comment.save();
    post.comments.push(comment._id);
    
    await post.save();
    res.status(200).json("Added a comment");
  } catch (error) {
    next(error);
  }
};
module.exports = { createComment };

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

const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const editComment=async(req,res,next)=>{
  try{
    const {content}=req.body;
    const commentId=req.params.id;
    const comment=await Comment.findById(commentId);

    if(!comment){
      return res.status(404).json({message:"Comment not found"});
    }

    if(comment.author.toString()!==req.user.id){
      return res.status(403).json({message:"You are not allowed to edit this comment"})
    }

    comment.body=content;
    await comment.save();
    res.status(200).json({message:"Comment Updated Successfully",comment})
  }
  catch(err){
    next(err);
  }
}

const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }
    await comment.remove();

    // Remove comment reference
    const post = await Post.findOne({ comments: commentId });
    if (post) {
      post.comments.pull(commentId);
      await post.save();
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = { createComment,editComment,deleteComment,getComment };

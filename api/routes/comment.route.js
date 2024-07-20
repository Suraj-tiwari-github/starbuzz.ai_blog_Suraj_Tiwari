const express = require("express");
const { createComment, editComment, deleteComment,getComment } = require("../controllers/comment.js");


const router = express.Router();
router.post("/", createComment);
router.put("/edit/:id",editComment);
router.delete("/delete/:id",deleteComment);
router.get("/:id", getComment);
module.exports = router;

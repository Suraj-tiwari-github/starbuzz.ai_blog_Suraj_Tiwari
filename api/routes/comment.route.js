const express = require("express");
const { createComment} = require("../controllers/comment.js");


const router = express.Router();
router.post("/", createComment);

module.exports = router;

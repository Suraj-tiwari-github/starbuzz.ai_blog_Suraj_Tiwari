const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const commentRoute = require("./routes/comment.route.js");
dotenv.config();
const app = express();
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const secret = process.env.secret;
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });
app.get("/test", (req, res) => {
  res.json("test ok");
});



app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Registration failed", details: e.message });
  }
});



app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: "User not found" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        secret,
        { expiresIn: "50m" },
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, {
              httpOnly: true,
              sameSite: "strict",
              maxAge: 50 * 60 * 1000,
            })
            .json({
              id: userDoc._id,
              username,
            });
        }
      );
    } else {
      res.status(400).json({ error: "Wrong credentials" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Login failed", details: e.message });
  }
});



app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, secret, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token", details: e.message });
  }
});


app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, sameSite: "strict" }).json("ok");
});



app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  try {
    jwt.verify(token, secret, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Post creation failed", details: e.message });
  }
});

app.use("/comments", commentRoute);

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  try {
    jwt.verify(token, secret, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json({ error: "You are not the author" });
      }
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          title,
          summary,
          content,
          cover: newPath ? newPath : postDoc.cover,
        },
        { new: true }
      );
      res.json(updatedPost);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Post update failed", details: e.message });
  }
});
app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: e.message });
  }
});
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id)
      .populate("author", ["username"])
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username",
        },
      });
    res.json(postDoc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch post", details: e.message });
  }
});
// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "An unexpected error occurred", details: err.message });
});
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

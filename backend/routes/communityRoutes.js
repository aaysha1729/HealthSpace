import express from "express";
import CommunityPost from "../models/CommunityPost.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { validate, postSchema, replySchema } from "../validation/schemas.js";

const router = express.Router();

// GET /api/community/posts
router.get("/posts", optionalAuth, async (req, res) => {
  try {
    const { category, limit = 20, skip = 0 } = req.query;

    const query = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    // Add user reaction status if authenticated
    const postsWithStatus = posts.map((post) => ({
      ...post,
      isRelating: req.userId
        ? post.reactions.some(
            (r) =>
              r.userId.toString() === req.userId.toString() &&
              r.type === "relate",
          )
        : false,
      relateCount: post.reactions.filter((r) => r.type === "relate").length,
      supportCount: post.reactions.filter((r) => r.type === "support").length,
      replyCount: post.replies.length,
    }));

    res.json(postsWithStatus);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// GET /api/community/posts/:id
router.get("/posts/:id", optionalAuth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id).lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      ...post,
      isRelating: req.userId
        ? post.reactions.some(
            (r) =>
              r.userId.toString() === req.userId.toString() &&
              r.type === "relate",
          )
        : false,
      relateCount: post.reactions.filter((r) => r.type === "relate").length,
      supportCount: post.reactions.filter((r) => r.type === "support").length,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// POST /api/community/posts
router.post("/posts", authenticate, validate(postSchema), async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await CommunityPost.create({
      authorId: req.userId,
      title,
      content,
      category: category || "GENERAL",
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

// POST /api/community/posts/:id/react
router.post("/posts/:id/react", authenticate, async (req, res) => {
  try {
    const { type = "relate" } = req.body;

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already reacted
    const existingIndex = post.reactions.findIndex(
      (r) => r.userId.toString() === req.userId.toString() && r.type === type,
    );

    if (existingIndex >= 0) {
      // Remove reaction
      post.reactions.splice(existingIndex, 1);
    } else {
      // Add reaction
      post.reactions.push({ userId: req.userId, type });
    }

    await post.save();

    res.json({
      relateCount: post.reactions.filter((r) => r.type === "relate").length,
      supportCount: post.reactions.filter((r) => r.type === "support").length,
      isRelating: type === "relate" && existingIndex < 0,
    });
  } catch (error) {
    console.error("React error:", error);
    res.status(500).json({ message: "Error toggling reaction" });
  }
});

// POST /api/community/posts/:id/reply
router.post(
  "/posts/:id/reply",
  authenticate,
  validate(replySchema),
  async (req, res) => {
    try {
      const { content } = req.body;

      const post = await CommunityPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      post.replies.push({
        authorId: req.userId,
        content,
      });

      await post.save();

      res.status(201).json(post.replies[post.replies.length - 1]);
    } catch (error) {
      console.error("Reply error:", error);
      res.status(500).json({ message: "Error adding reply" });
    }
  },
);

// DELETE /api/community/posts/:id
router.delete("/posts/:id", authenticate, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

export default router;

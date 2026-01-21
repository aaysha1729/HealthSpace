import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communityPostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: [
        "IRREGULAR CYCLES",
        "PCOS SUPPORT",
        "MEDICATION",
        "GENERAL",
        "QUESTIONS",
      ],
      default: "GENERAL",
    },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["relate", "support"], default: "relate" },
      },
    ],
    replies: [replySchema],
  },
  {
    timestamps: true,
  },
);

// Virtual for reaction counts
communityPostSchema.virtual("relateCount").get(function () {
  return this.reactions.filter((r) => r.type === "relate").length;
});

communityPostSchema.virtual("supportCount").get(function () {
  return this.reactions.filter((r) => r.type === "support").length;
});

communityPostSchema.set("toJSON", { virtuals: true });

export default mongoose.model("CommunityPost", communityPostSchema);

import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    user: {
      fullName: String,
      avatarURL: String,
      _id: String,
    },
  },
  { timestamps: true }
);

const PostScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    text: {
      type: String,
      require: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    comments: [CommentSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostScheme);

import mongoose from "mongoose";

const UserScheme = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      require: true,
    },
    avatarURL: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserScheme);

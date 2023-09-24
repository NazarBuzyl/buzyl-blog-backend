import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  loginValidation,
  registerValidator,
  postCreateValidation,
} from "./validation.js";

import { validAuth, handleValidationErrors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

// ---------------------------------------------------------------- Database connect ----------------------------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connect DB"))
  .catch(() => console.log("Failed to connect"));

// ---------------------------------------------------------------- Express server ----------------------------------------------------------------
const app = express();
const port = 4444;

// ---------------------------------------------------------------- Storage for image - multer ----------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

// ---------------------------------------------------------------- HTTP Requests ----------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome");
});

// ---------------------------------------------------------------- Login/Registration/Authentication ----------------------------------------------------------------
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", validAuth, UserController.getMe);

// ---------------------------------------------------------------- Upload image ----------------------------------------------------------------
app.post("/upload", validAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// ---------------------------------------------------------------- Post action ----------------------------------------------------------------
app.get("/posts", PostController.getAll);
app.get("/posts/popularity", PostController.getPopularity);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", validAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", validAuth, PostController.remove);
app.patch("/posts/:id", validAuth, postCreateValidation, PostController.update);

app.get("/tags", PostController.getLastTags);
app.get("/tags/:id", PostController.getPostsByTag);

// ---------------------------------------------------------------- Server result ----------------------------------------------------------------
app.listen(process.env.PORT || port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Server:${port} OK`);
});

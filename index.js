import express from "express";
import mongoose from "mongoose";

import { loginValidation, registerValidator } from "./validation.js";

import { validAuth, handleValidationErrors } from "./utils/index.js";
import { UserController } from "./controllers/index.js";

// ---------------------------------------------------------------- Database connect ----------------------------------------------------------------
mongoose
  .connect(
    "mongodb+srv://admin:legend5432@cluster0.3amxre6.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect DB");
  })
  .catch(() => {
    console.log("Failed to connect");
  });

// ---------------------------------------------------------------- Express server ----------------------------------------------------------------
const app = express();
const port = 4444;

app.use(express.json());

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

// ---------------------------------------------------------------- Server result ----------------------------------------------------------------
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Server:${port} OK`);
});

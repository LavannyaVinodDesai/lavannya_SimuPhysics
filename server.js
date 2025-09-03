const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

/* ---------- AUTH ROUTES ---------- */

// Register
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).send("Missing fields");

  // Strong password validation
  const strongPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!strongPassword) {
    return res.status(400).send("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashed });
  await newUser.save();

  req.session.userId = newUser._id;
  res.json({ success: true, user: { name: newUser.name, email: newUser.email } });
});


// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Invalid password");

  req.session.userId = user._id;
  res.json({ success: true, user: { name: user.name, email: user.email } });
});

// Check session
app.get("/api/me", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ loggedIn: false });

  const user = await User.findById(req.session.userId);
  res.json({ loggedIn: true, user: { name: user.name, email: user.email } });
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

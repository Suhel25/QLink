const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,            
    sameSite: isProduction ? "None" : "Lax", 
    maxAge: 60 * 60 * 1000,          
  });
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    
    const passwordHash = await bcrypt.hash(password, 10);

    
    const user = await User.create({ name, email, passwordHash });

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    setAuthCookie(res, token);

    res.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};


exports.logout = (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      })
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};


exports.me = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { _id, name, email, role } = req.user;
    res.json({
      user: { id: _id, name, email, role },
    });
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

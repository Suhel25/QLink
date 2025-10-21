const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protect = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-passwordHash");

    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    res.status(401).json({ error: "Invalid or expired token" });
  }
};


const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = { protect, adminOnly };

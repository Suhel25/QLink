const express = require("express");
const {
  register,
  login,
  logout,
  me, 
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", register);
router.post("/login", login);


router.post("/logout", protect, logout);
router.get("/me", protect, me); 

module.exports = router;

const express = require("express");
const { adminOnly, protect } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getAllLinks,
  getUserLinks,
  getTopUsers,
  getTopLinks,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.get("/links", protect, adminOnly, getAllLinks);
router.get("/users/:userId/links", protect, adminOnly, getUserLinks);
router.get("/top-users", protect, adminOnly, getTopUsers);
router.get("/top-links", protect, adminOnly, getTopLinks);

module.exports = router;

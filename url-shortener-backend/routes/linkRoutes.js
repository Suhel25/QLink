const express = require("express");
const router = express.Router();
const {
  createLink,
  getMyLinks,
  deleteLink,
  toggleLinkStatus,
  redirectLink,
  createGuestLink, 
} = require("../controllers/linkController");
const { protect } = require("../middleware/authMiddleware");


router.post("/", protect, createLink);
router.get("/", protect, getMyLinks);
router.delete("/:id", protect, deleteLink);
router.patch("/:id", protect, toggleLinkStatus);


router.post("/guest", createGuestLink); 
router.get("/:slug", redirectLink);

module.exports = router;

const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clicks: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  guest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastClickedAt: Date,
});

module.exports = mongoose.model("Link", linkSchema);

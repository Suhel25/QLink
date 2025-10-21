const User = require("../models/User");
const Link = require("../models/Link");


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "owner",
          as: "links",
        },
      },
      {
        $addFields: {
          totalLinks: { $size: "$links" },
          totalClicks: { $sum: "$links.clicks" },
        },
      },
      { $project: { name: 1, email: 1, role: 1, totalLinks: 1, totalClicks: 1 } },
    ]);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().populate("owner", "name email");
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch links" });
  }
};


exports.getUserLinks = async (req, res) => {
  try {
    const links = await Link.find({ owner: req.params.userId });
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user's links" });
  }
};


exports.getTopUsers = async (req, res) => {
  try {
    const topUsers = await User.aggregate([
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "owner",
          as: "links",
        },
      },
      {
        $addFields: {
          totalClicks: { $sum: "$links.clicks" },
        },
      },
      { $sort: { totalClicks: -1 } },
      { $limit: 10 },
      { $project: { name: 1, email: 1, totalClicks: 1 } },
    ]);
    res.json(topUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top users" });
  }
};


exports.getTopLinks = async (req, res) => {
  try {
    const topLinks = await Link.find().sort({ clicks: -1 }).limit(10);
    res.json(topLinks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top links" });
  }
};

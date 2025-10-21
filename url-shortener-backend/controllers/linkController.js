const { nanoid } = require("nanoid");
const Link = require("../models/Link");

exports.createLink = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: "originalUrl is required" });

    const slug = nanoid(8);
    const shortUrl = `${process.env.BASE_URL}/${slug}`;

    const link = await Link.create({
      slug,
      originalUrl,
      shortUrl,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Short link created successfully",
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create link failed" });
  }
};

exports.getMyLinks = async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user._id });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch links" });
  }
};


exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!link) return res.status(404).json({ error: "Link not found" });
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};


exports.toggleLinkStatus = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!link) return res.status(404).json({ error: "Link not found" });

    link.isActive = !link.isActive;
    await link.save();

    res.json({ message: "Status updated", link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Status update failed" });
  }
};

exports.redirectLink = async (req, res) => {
  try {
    const { slug } = req.params;
    const link = await Link.findOne({ slug });
    if (!link) return res.status(404).send("Not found");

    link.clicks++;
    link.lastClickedAt = new Date();
    await link.save();

    res.redirect(link.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Redirect failed");
  }
};

exports.createGuestLink = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl)
      return res.status(400).json({ error: "originalUrl is required" });

    const slug = nanoid(8);
    const shortUrl = `${process.env.BASE_URL}/${slug}`;

    const link = await Link.create({
      slug,
      originalUrl,
      shortUrl,
      guest: true, 
    });

    res.status(201).json({
      message: "Guest short link created successfully",
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Guest link creation failed" });
  }
};


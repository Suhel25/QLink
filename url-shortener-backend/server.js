const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { redirectLink } = require("./controllers/linkController");

require("dotenv").config();

const app = express();
connectDB();


const allowedOrigin = process.env.ALLOWED_ORIGIN;


app.use(
  "/api",
  cors({
    origin: (origin, callback) => {
      
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        console.error(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/admin", adminRoutes);


app.get("/:slug", redirectLink);


app.get("/", (req, res) => {
  res.send(" QLink backend running successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

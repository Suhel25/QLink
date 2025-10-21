const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { redirectLink } = require("./controllers/linkController"); 


require("dotenv").config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


connectDB();


const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const adminRoutes = require("./routes/adminRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/admin", adminRoutes);


app.get("/:slug", redirectLink); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

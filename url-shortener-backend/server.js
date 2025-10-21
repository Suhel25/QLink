const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { redirectLink } = require("./controllers/linkController"); 


require("dotenv").config();

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
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

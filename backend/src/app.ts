import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route"; // Adjust the path as needed

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
// Placeholder route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;

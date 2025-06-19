import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

app.use(
  cors({
    origin:[ "http://localhost:5173","https://study-companion-1-wp95.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Global error handler - must be last
app.use(errorHandler);

export default app;

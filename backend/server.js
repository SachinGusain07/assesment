import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDB } from "./src/config/db.js";
import allRoutes from "./src/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("<h1>Server is Up and Running.....</h1>");
});

app.use("/api/v1", allRoutes);

// Database connection and server initialization
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();
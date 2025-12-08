import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { initializeDB } from "./config/db";
import authRoutes from "./Router/auth.routes";
import vehicleRoutes from "./Router/vehicles.routes";
import { authenticate } from "./Middleware/auth.middleware";
import bookingRoutes from "./Router/booking.routes";

const app = express();

// Middleware
app.use(express.json());

// Initialize Database
initializeDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", authenticate, vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running successfully");
});

// Vercel port
const port = process.env.PORT || 5080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

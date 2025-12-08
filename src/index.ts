import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

import express, { Request, Response } from "express";
import { initializeDB } from "./config/db";
import authRoutes from "./Router/auth.routes";
import vehicleRoutes from "./Router/vehicles.routes";
import { authenticate } from "./Middleware/auth.middleware";
import bookingRoutes from "./Router/booking.routes";

const app = express();

app.use(express.json());

// Initialize database
initializeDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", authenticate, vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Vercel!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});


export default app;
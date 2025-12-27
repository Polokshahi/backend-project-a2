import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { initializeDB } from "./config/db";
import authRoutes from "./Router/auth.routes";
import vehicleRoutes from "./Router/vehicles.routes";
import userRoutes from "./Router/users.routes";
import bookingRoutes from "./Router/booking.routes";

dotenv.config();

const app = express();


app.use(express.json());


initializeDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/users", userRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("Server is running successfully");
});


const port = process.env.PORT || 5080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

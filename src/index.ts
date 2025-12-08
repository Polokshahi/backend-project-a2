import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), ".env") });
import express from "express";
import { Request, Response } from "express";
import { initializeDB } from './config/db';
import authRoutes from './Router/auth.routes';
import vehicleRoutes from './Router/vehicles.routes';
import { authenticate } from './Middleware/auth.middleware';
import bookingRoutes from './Router/booking.routes';

const app = express();
const port = process.env.PORT || 5080;


app.use(express.json());

// database initialization
initializeDB();



app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', authenticate, vehicleRoutes); 
app.use("/api/v1/bookings", bookingRoutes);









app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
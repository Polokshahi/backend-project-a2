import { Router } from "express";
import { pool } from "../config/db";
import { authenticate, authorize } from "../Middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, authorize(["customer", "admin"]), async (req, res) => {
  const { vehicle_id, rent_start_date, rent_end_date } = req.body;
  const customer_id = req.user?.userId;

  if (!vehicle_id || !rent_start_date || !rent_end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const vehicleResult = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleResult.rows.length === 0)
      return res.status(404).json({ error: "Vehicle not found" });

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== "available") {
      return res.status(400).json({ error: "Vehicle is not available" });
    }

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ error: "rent_end_date must be after rent_start_date" });
    }

    const total_price = parseFloat(vehicle.daily_rent_price) * days;


    const bookingResult = await pool.query(
      `INSERT INTO bookings 
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );


    await pool.query("UPDATE vehicles SET availability_status = 'booked' WHERE id = $1", [vehicle_id]);

    return res.status(201).json({
      message: "Booking created successfully",
      booking: bookingResult.rows[0],
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/", authenticate, async (req, res) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  try {
    let result;
    if (role === "admin") {
      result = await pool.query(
        `SELECT b.*, u.name AS customer_name, v.vehicle_name
         FROM bookings b
         JOIN users u ON b.customer_id = u.id
         JOIN vehicles v ON b.vehicle_id = v.id`
      );
    } else {
      result = await pool.query(
        `SELECT b.*, v.vehicle_name
         FROM bookings b
         JOIN vehicles v ON b.vehicle_id = v.id
         WHERE b.customer_id = $1`,
        [userId]
      );
    }

    return res.json(result.rows);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


router.put("/:id", authenticate, async (req, res) => {
  const bookingId = req.params.id;
  const role = req.user?.role;
  const userId = req.user?.userId;

  try {
    const bookingResult = await pool.query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
    if (bookingResult.rows.length === 0) return res.status(404).json({ error: "Booking not found" });

    const booking = bookingResult.rows[0];

    if (role === "customer") {
      if (booking.customer_id !== userId)
        return res.status(403).json({ error: "Not your booking" });

      const today = new Date();
      const startDate = new Date(booking.rent_start_date);
      if (today > startDate) return res.status(400).json({ error: "Cannot cancel after rent_start_date" });

      await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [bookingId]);
      await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.vehicle_id]);

      return res.json({ message: "Booking cancelled successfully" });
    }

    if (role === "admin") {
      await pool.query("UPDATE bookings SET status = 'returned' WHERE id = $1", [bookingId]);
      await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.vehicle_id]);

      return res.json({ message: "Vehicle returned successfully" });
    }

    return res.status(403).json({ error: "Forbidden" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

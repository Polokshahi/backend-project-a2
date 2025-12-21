import { Router, Request, Response } from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import { pool } from "../config/db";



const router = Router();

router.get(
  "/",
  authenticate,
  authorize(["admin"]),
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users ORDER BY name`
      );

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);


router.put(
  "/:userId",
  authenticate,
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email, phone, role } = req.body;

    try {
     
      const loggedInUser = req.user!;

 
      if (loggedInUser.role !== "admin" && loggedInUser.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "You can update only your own profile",
        });
      }

     
      if (role && loggedInUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can update role",
        });
      }

      const result = await pool.query(
        `
        UPDATE users
        SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          role = COALESCE($4, role)
        WHERE id = $5
        RETURNING id, name, email, phone, role
        `,
        [name, email, phone, role, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);


router.delete(
  "/:userId",
  authenticate,
  authorize(["admin"]),
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {

      const activeBookings = await pool.query(
        `
        SELECT id FROM bookings
        WHERE customer_id = $1 AND status = 'active'
        `,
        [userId]
      );

      if (activeBookings.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete user with active bookings",
        });
      }

      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

export default router;

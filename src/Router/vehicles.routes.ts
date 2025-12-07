import { Router } from 'express';
import { pool } from '../config/db';
import { authenticate, authorize } from '../Middleware/auth.middleware';

const router = Router();

router.get('/', async (_req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vehicles');
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [vehicle_name, type, registration_number, daily_rent_price, availability_status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
    
});
router.put('/:vehicleId', authenticate, authorize(['admin']), async (req, res) => {
    const { vehicleId } = req.params;
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE vehicles 
             SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
             WHERE id=$6 RETURNING *`,
            [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});


router.delete('/:vehicleId', authenticate, authorize(['admin']), async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const checkBookings = await pool.query(
            `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
            [vehicleId]
        );
        if (checkBookings.rows.length > 0)
            return res.status(400).json({ error: 'Cannot delete vehicle with active bookings' });

        const result = await pool.query('DELETE FROM vehicles WHERE id=$1 RETURNING *', [vehicleId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

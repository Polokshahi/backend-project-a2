import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';

const router = Router();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}


router.post('/signup', async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email exists
    const existing = await pool.query('SELECT * FROM users WHERE email = LOWER($1)', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role)
       VALUES ($1, LOWER($2), $3, $4, $5) RETURNING id, name, email, role`,
      [name, email.trim(), hashedPassword, phone, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = LOWER($1)', [email.trim().toLowerCase()]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = userResult.rows[0];

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });


    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err: any) {
    console.error('Signin error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

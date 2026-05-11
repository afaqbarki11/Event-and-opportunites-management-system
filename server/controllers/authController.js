const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, department } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, role, phone, department) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, 'student', phone || null, department || null]
    );

    const token = generateToken({ id: result.insertId, email, role: 'student' });

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: result.insertId, full_name, email, role: 'student', phone, department },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, full_name, email, role, phone, department, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, department } = req.body;

    await pool.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), department = COALESCE(?, department) WHERE id = ?',
      [full_name, phone, department, req.user.id]
    );

    const [users] = await pool.query(
      'SELECT id, full_name, email, role, phone, department, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated successfully.', user: users[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

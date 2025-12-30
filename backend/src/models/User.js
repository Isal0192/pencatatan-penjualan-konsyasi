import pool from '../config/database.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const User = {
  create: async (name, email, password, phone, address, role) => {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, phone, address, created_at',
      [name, email, hashedPassword, phone, address, role]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  authenticate: async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    };
  },

  getAll: async (role = null) => {
    let query = 'SELECT id, name, email, role, phone, address, created_at FROM users';
    const params = [];
    
    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }
};

export default User;

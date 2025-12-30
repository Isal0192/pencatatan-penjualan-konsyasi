import pool from '../config/database.js';

export const Information = {
  create: async (penjualId, content) => {
    const result = await pool.query(
      'INSERT INTO information (penjual_id, content) VALUES ($1, $2) RETURNING *',
      [penjualId, content]
    );
    return result.rows[0];
  },

  getAll: async () => {
    const result = await pool.query(
      `SELECT i.*, u.name as penjual_name 
       FROM information i
       LEFT JOIN users u ON i.penjual_id = u.id
       ORDER BY i.created_at DESC`
    );
    return result.rows;
  },
};

export default Information;

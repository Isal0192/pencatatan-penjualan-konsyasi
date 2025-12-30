import pool from '../config/database.js';

export const addInformationTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS information (
        id SERIAL PRIMARY KEY,
        penjual_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "information" created successfully!');
  } catch (error) {
    console.error('Error creating "information" table:', error);
    throw error;
  }
};

export default addInformationTable;

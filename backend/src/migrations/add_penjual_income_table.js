import pool from '../config/database.js';

export const addPenjualIncomeTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS penjual_income (
        id SERIAL PRIMARY KEY,
        penjual_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_sales VARCHAR(255) NOT NULL,
        total_commission VARCHAR(255) NOT NULL,
        net_income VARCHAR(255) NOT NULL,
        month DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "penjual_income" created successfully!');
  } catch (error) {
    console.error('Error creating "penjual_income" table:', error);
    throw error;
  }
};

export default addPenjualIncomeTable;

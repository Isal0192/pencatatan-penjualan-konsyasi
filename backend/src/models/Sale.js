import pool from '../config/database.js';
import Penitip_income from './penitip_income.js';
import Penjual_income from './Penjual_income.js';

export const Sale = {
  create: async (itemId, penjualId, penitipId, quantitySold, sellingUnitPrice, penitipUnitPrice) => {
    // Business rule: penitip provides a base price (penitipUnitPrice). Penjual may sell at sellingUnitPrice.
    // Penitip should receive (penitipUnitPrice * quantitySold). Penjual income is the remainder.
    const totalPrice = quantitySold * sellingUnitPrice;
    const penitipTotal = quantitySold * penitipUnitPrice;
    const penjualIncome = totalPrice - penitipTotal;
    const commissionAmount = 0; // platform commission currently 0; business split is between penitip & penjual

    const result = await pool.query(
      `INSERT INTO sales (item_id, penjual_id, penitip_id, quantity_sold, unit_price, total_price, commission_percentage, commission_amount, penjual_income, status, sale_date)
       VALUES ($1, $2, $3, $4, $5, $6, NULL, $7, $8, 'completed', CURRENT_TIMESTAMP)
       RETURNING *`,
      [itemId, penjualId, penitipId, quantitySold, sellingUnitPrice, totalPrice, commissionAmount, penjualIncome]
    );
    
    // panggil update penitip income untuk update 
    const penitipIncome = totalPrice - penjualIncome;
    // Di model Sale.js
    await Penitip_income.createPenitipIncome(penitipId, itemId, totalPrice, penitipIncome, new Date());

    // panggil update penjual income untuk update
    await Penjual_income.createPenjualIncome(penjualId, totalPrice, commissionAmount, penjualIncome, new Date());

    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM sales WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByItemId: async (itemId) => {
    const result = await pool.query('SELECT * FROM sales WHERE item_id = $1 ORDER BY sale_date DESC', [itemId]);
    return result.rows;
  },

  findByPenitipId: async (penitipId) => {
    const result = await pool.query(
      `SELECT s.*, u.name as penjual_name
       FROM sales s
       LEFT JOIN users u ON s.penjual_id = u.id
       WHERE s.penitip_id = $1 
       ORDER BY s.sale_date DESC`,
      [penitipId]
    );
    return result.rows;
  },

  findByPenjualId: async (penjualId) => {
    const result = await pool.query(
      `SELECT s.*, u.name as penitip_name
       FROM sales s
       LEFT JOIN users u ON s.penitip_id = u.id
       WHERE s.penjual_id = $1 
       ORDER BY s.sale_date DESC`,
      [penjualId]
    );
    return result.rows;
  },

  getMonthlyReportByPenitip: async (penitipId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await pool.query(
      `SELECT 
        item_id,
        SUM(total_price) as total_sales,
        SUM(commission_amount) as total_commission,
        COUNT(*) as transaction_count
       FROM sales
       WHERE penitip_id = $1 
       AND sale_date >= $2 
       AND sale_date < $3
       GROUP BY item_id`,
      [penitipId, startDate, endDate]
    );
    return result.rows;
  },

  getMonthlyReportByPenjual: async (penjualId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await pool.query(
      `SELECT 
        SUM(penjual_income) as total_penjual_income,
        SUM(commission_amount) as total_commission,
        SUM(total_price) as total_sales,
        COUNT(*) as transaction_count
       FROM sales
       WHERE penjual_id = $1 
       AND sale_date >= $2 
       AND sale_date < $3`,
      [penjualId, startDate, endDate]
    );
    return result.rows[0];
  },

  getIncomeSummaryByPenjual: async (penjualId) => {
    try {
      const result = await pool.query(
        `SELECT 
          SUM(penjual_income) as total_income,
          COUNT(*) as transaction_count
         FROM sales
         WHERE penjual_id = $1`,
        [penjualId]
      );
      // The query returns one row, even if there are no sales (SUM and COUNT are aggregate functions)
      // If no rows match, SUM is null and COUNT is 0.
      const summary = result.rows[0];
      return {
        total_income: parseFloat(summary.total_income) || 0,
        transaction_count: parseInt(summary.transaction_count, 10) || 0,
      };
    } catch (error) {
      console.error('Error getting income summary by penjual_id:', error);
      throw error;
    }
  },

  deleteByPenjualId: async (penjualId) => {
    const result = await pool.query(
      'DELETE FROM sales WHERE penjual_id = $1 RETURNING id',
      [penjualId]
    );
    return result.rows;
  },

  deleteBySaleId: async (saleId) => {
    const result = await pool.query(
      'DELETE FROM sales WHERE id = $1 RETURNING *',
      [saleId]
    );
    return result.rows[0];
  }
};

export default Sale;

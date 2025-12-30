import pool from '../config/database.js';

export const Item = {
  create: async (penitipId, name, description, quantity, price, imageUrl) => {
    const result = await pool.query(
      'INSERT INTO items (penitip_id, name, description, quantity, price, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [penitipId, name, description, quantity, price, imageUrl]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByPenitipId: async (penitipId) => {
    const result = await pool.query('SELECT * FROM items WHERE penitip_id = $1 ORDER BY created_at DESC', [penitipId]);
    return result.rows;
  },

  getAll: async () => {
    const result = await pool.query(
      `SELECT i.*, u.name as penitip_name 
       FROM items i
       LEFT JOIN users u ON i.penitip_id = u.id
       WHERE i.status = 'tersedia' AND i.quantity > 0
       AND NOT EXISTS (SELECT 1 FROM sales WHERE sales.item_id = i.id)
       ORDER BY i.created_at DESC`
    );
    return result.rows;
  },

  update: async (id, name, description, quantity, price, status, imageUrl) => {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, status = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, quantity, price, status, imageUrl, id]
    );
    return result.rows[0];
  },

  updateQuantity: async (id, quantityChange) => {
    const result = await pool.query(
      'UPDATE items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantityChange, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },

  // Get sold items by Penitip (items yang sudah terjual)
  getSoldItems: async (penitipId) => {
    const result = await pool.query(
      `SELECT 
        s.id as sale_id,
        i.id,
        i.name,
        i.price,
        SUM(s.quantity_sold) as total_quantity_sold,
        COUNT(s.id) as total_transactions,
        SUM(s.total_price) as total_revenue,
        SUM(s.commission_amount) as total_commission,
        MAX(s.sale_date) as last_sold_date,
        u.name as penjual_name,
        u.phone as penjual_phone
       FROM sales s
       JOIN items i ON s.item_id = i.id
       JOIN users u ON s.penjual_id = u.id
       WHERE i.penitip_id = $1
       GROUP BY i.id, i.name, i.price, u.id, u.name, u.phone, s.id
       ORDER BY MAX(s.sale_date) DESC`,
      [penitipId]
    );
    return result.rows;
  },

  // Get sold items detail (per transaction)
  getSoldItemsDetail: async (penitipId) => {
    const result = await pool.query(
      `SELECT 
        s.id,
        i.id as item_id,
        i.name as item_name,
        i.price as unit_price,
        s.quantity_sold,
        s.total_price,
        s.commission_amount,
        s.penjual_income,
        s.commission_percentage,
        s.sale_date,
        u.name as penjual_name,
        u.phone as penjual_phone,
        u.email as penjual_email
       FROM sales s
       JOIN items i ON s.item_id = i.id
       JOIN users u ON s.penjual_id = u.id
       WHERE i.penitip_id = $1
       ORDER BY s.sale_date DESC`,
      [penitipId]
    );
    return result.rows;
  },

  // Get sold items summary by period (Penitip dashboard)
  getSoldItemsSummary: async (penitipId, year, month) => {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT i.id) as total_items_sold,
        SUM(s.quantity_sold) as total_quantity,
        SUM(s.total_price) as total_sales,
        SUM(s.commission_amount) as total_commission,
        COUNT(DISTINCT s.penjual_id) as unique_sellers
       FROM sales s
       JOIN items i ON s.item_id = i.id
       WHERE i.penitip_id = $1
       AND EXTRACT(YEAR FROM s.sale_date) = $2
       AND EXTRACT(MONTH FROM s.sale_date) = $3`,
      [penitipId, year, month]
    );
    return result.rows[0];
  }
};

export default Item;

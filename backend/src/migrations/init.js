import pool from '../config/database.js';

export const initDatabase = async () => {
  try {
    // Tabel Users (Penitip dan Penjual)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role VARCHAR(50) NOT NULL CHECK (role IN ('penitip', 'penjual')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabel Barang (Titipan)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        penitip_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INTEGER NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'habis', 'tidak_aktif')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabel Penjualan
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        penjual_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        penitip_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quantity_sold INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(12, 2) NOT NULL,
        commission_percentage DECIMAL(5, 2) DEFAULT 20.00,
        commission_amount DECIMAL(12, 2),
        penjual_income DECIMAL(12, 2),
        status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'returned', 'pending')),
        sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabel Rekap Pendapatan Penitip
    await pool.query(`
      CREATE TABLE IF NOT EXISTS penitip_income (
        id SERIAL PRIMARY KEY,
        penitip_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        total_sales VARCHAR(255) DEFAULT '0',
        total_income VARCHAR(255) DEFAULT '0',
        month DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabel Rekap Pendapatan Penjual
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

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default initDatabase;

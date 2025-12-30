import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';
import initDatabase from './migrations/init.js';
import addInformationTable from './migrations/add_information_table.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import saleRoutes from './routes/sales.js';
import informationRoutes from './routes/information.js';
import incomeRoutes from './routes/income.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Hanya izinkan domain frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', itemRoutes);
app.use('/api', saleRoutes);
app.use('/api', informationRoutes);
app.use('/api/income', incomeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// --- Serve Frontend ---
const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});
// --------------------

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    // Initialize database tables
    await initDatabase();
    await addInformationTable();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

import express from 'express';
import incomeController from '../controllers/incomeController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET total income by penitip_id
// Accessible by 'penitip'
router.get('/penitip/:penitip_id', authMiddleware, roleMiddleware('penitip'), incomeController.getTotalIncomeByPenitipId);

// GET total income by penjual_id
// Accessible by 'penjual'
router.get('/penjual/:penjual_id', authMiddleware, roleMiddleware('penjual'), incomeController.getTotalIncomeByPenjualId);


export default router;

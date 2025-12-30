import express from 'express';
import * as saleController from '../controllers/saleController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Penjual routes
router.post('/sales', authMiddleware, roleMiddleware(['penjual']), saleController.createSale);
router.get('/sales/my', authMiddleware, roleMiddleware(['penjual']), saleController.getMySales);
router.delete('/sales/reset', authMiddleware, roleMiddleware(['penjual']), saleController.resetPenjualSales);
router.delete('/sales/:saleId', authMiddleware, roleMiddleware(['penjual']), saleController.deleteSale);
router.get('/sales/penjual/income', authMiddleware, roleMiddleware(['penjual']), saleController.getTotalPenjualIncome);
router.get('/sales/penjual/monthly-report', authMiddleware, roleMiddleware(['penjual']), saleController.getPenjualMonthlyReport);

// Penitip routes
router.get('/sales/penitip', authMiddleware, roleMiddleware(['penitip']), saleController.getPenitipSales);
router.get('/sales/penitip/income', authMiddleware, roleMiddleware(['penitip']), saleController.getPenitipTotalIncome);
router.get('/sales/penitip/monthly-report', authMiddleware, roleMiddleware(['penitip']), saleController.getPenitipMonthlyReport);

export default router;

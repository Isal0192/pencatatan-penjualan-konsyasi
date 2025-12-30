import express from 'express';
import * as itemController from '../controllers/itemController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Penitip: Create item
router.post('/items', authMiddleware, roleMiddleware(['penitip']), itemController.createItem);

// Penitip: Get my items (available)
router.get('/items/my', authMiddleware, roleMiddleware(['penitip']), itemController.getMyItems);

// Penitip: Get sold items (grouped)
router.get('/items/sold/summary', authMiddleware, roleMiddleware(['penitip']), itemController.getSoldItems);

// Penitip: Get sold items detail (per transaction)
router.get('/items/sold/detail', authMiddleware, roleMiddleware(['penitip']), itemController.getSoldItemsDetail);

// Penitip: Get sold items statistics by period
router.get('/items/sold/statistics', authMiddleware, roleMiddleware(['penitip']), itemController.getSoldItemsSummary);

// Public: Get all available items (Penjual catalog)
router.get('/items', authMiddleware, itemController.getAllItems);

// Get item by ID
router.get('/items/:id', authMiddleware, itemController.getItemById);

// Penitip: Update item
router.put('/items/:id', authMiddleware, roleMiddleware(['penitip']), itemController.updateItem);

// Penitip: Delete item
router.delete('/items/:id', authMiddleware, roleMiddleware(['penitip']), itemController.deleteItem);

export default router;


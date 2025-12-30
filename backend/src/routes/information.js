import express from 'express';
import * as informationController from '../controllers/informationController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Penjual: Create information
router.post('/information', authMiddleware, roleMiddleware(['penjual']), informationController.createInformation);

// Both: Get all information
router.get('/information', authMiddleware, roleMiddleware(['penjual', 'penitip']), informationController.getInformation);

export default router;

import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/users', authMiddleware, authController.getAllUsers);
router.get('/penitips', authMiddleware, authController.getPenitips);
router.get('/penjuals', authMiddleware, authController.getPenjuals);

export default router;

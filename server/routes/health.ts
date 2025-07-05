import express from 'express';
import { healthController } from '../controllers/pages/health';

const router = express.Router();

// Health check route
router.get('/', healthController.index);

export default router;

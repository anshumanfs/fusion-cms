import express from 'express';
import { homeController } from '../controllers/pages/home';

const router = express.Router();

// Home page route
router.get('/', homeController.index);

export default router;

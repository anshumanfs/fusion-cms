import express from 'express';
import { authController } from '../controllers/pages/auth';

const router = express.Router();

// Authentication routes
router.get('/', authController.index);
router.get('/login', authController.login);
router.get('/signup', authController.signup);
router.get('/reset-password', authController.resetPassword);
router.get('/validate/:token', authController.validateUser);
router.get('/validate-reset/:token', authController.validateReset);
router.get('/logout', authController.logout);

// Authentication API routes
router.post('/login', authController.processLogin);
router.post('/signup', authController.processSignup);
router.post('/reset-password', authController.processResetPassword);

export default router;

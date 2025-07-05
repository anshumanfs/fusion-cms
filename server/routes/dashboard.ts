import express from 'express';
import { dashboardController } from '../controllers/pages/dashboard';
import { isAuthenticated } from '../middlewares/ejsAuth';

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(isAuthenticated);

// Dashboard routes
router.get('/', dashboardController.index);

// Database routes
router.get('/databases', dashboardController.databases);
router.post('/databases/add', dashboardController.addDatabase);
router.post('/databases/delete/:id', dashboardController.deleteDatabase);

// Schema routes
router.get('/schemas', dashboardController.schemas);
router.post('/schemas/add', dashboardController.addSchema);
router.post('/schemas/delete/:id', dashboardController.deleteSchema);

// User routes
router.get('/users', dashboardController.users);
router.post('/users/add', dashboardController.addUser);
router.post('/users/delete/:id', dashboardController.deleteUser);

export default router;

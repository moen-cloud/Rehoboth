import express from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminUsers,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require auth + admin
router.use(protect, admin);

router.get('/stats', getDashboardStats);

router.route('/products')
  .get(getAdminProducts)
  .post(createAdminProduct);

router.route('/products/:id')
  .put(updateAdminProduct)
  .delete(deleteAdminProduct);

router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateAdminOrderStatus);

router.get('/users', getAdminUsers);

export default router;
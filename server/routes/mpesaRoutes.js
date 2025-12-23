import express from 'express';
import { stkPush, mpesaCallback } from '../controllers/mpesaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/stkpush', protect, stkPush);
router.post('/callback', mpesaCallback);

export default router;
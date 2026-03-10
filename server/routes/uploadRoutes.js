import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
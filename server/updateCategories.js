import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const updateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Update all products with category "Cereals" to "Spices"
    const result = await Product.updateMany(
      { category: 'Cereals' },
      { $set: { category: 'Spices' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products from Cereals to Spices`);

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateCategories();
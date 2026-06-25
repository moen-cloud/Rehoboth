import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const renameCategory = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const result = await Product.updateMany(
      { category: 'Other' },
      { $set: { category: 'Pantry Staples' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} product(s) from "Other" to "Pantry Staples"`);

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

renameCategory();
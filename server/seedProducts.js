import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: "Army Beans 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 40,
    image: "/images/products/army-beans.jpg",
    category: "Cereals",
    stock: 50
  },

  {
    name: "Yellow Beans 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 180,
    image: "/images/products/yellow-beans.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Nyayo beans 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 180,
    image: "/images/products/nyayo-beans.jpg",
    category: "Cereals",
    stock: 45
  },


  {
    name: "Wairimu beans 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 170,
    image: "/images/products/wairimu-beans.jpg",
    category: "Cereals",
    stock: 45
  },

{
    name: "Njahi 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 210,
    image: "/images/products/njahi.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Njugu Karanga Ndogo 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 320,
    image: "/images/products/njugu-small.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Njugu Karanga Kubwa 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 330,
    image: "/images/products/karanga-kubwa.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Njugu Karanga White 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 320,
    image: "/images/products/karanga-white.jpg",
    category: "Cereals",
    stock: 100
  },


  {
    name: "White Mbaazi 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 150,
    image: "/images/products/mbaazi-white.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Mbaazi 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 150,
    image: "/images/products/mbaazi-red.jpg",
    category: "Cereals",
    stock: 100
  },


  {
    name: "Pinto Beans (Rosecoco) 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 150,
    image: "/images/products/rosecoco.jpg",
    category: "Cereals",
    stock: 100
  },


  {
    name: "Cream Pinto Beans (Mwitemania) 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 150,
    image: "/images/products/cream-pinto-beans.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Basmati Rice 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 200,
    image: "/images/products/basmati-rice.jpg",
    category: "Grains",
    stock: 100
  },


  {
    name: "Jumbo Popcorns 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 200,
    image: "/images/products/popcorn.jpg",
    category: "Grains",
    stock: 100
  },


  {
    name: "Mwea Pishori Rice 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 200,
    image: "/images/products/pishori-rice.jpg",
    category: "Grains",
    stock: 100
  },

{
    name: "Brown Rice 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 200,
    image: "/images/products/brown-rice.jpg",
    category: "Grains",
    stock: 100
  },


  {
    name: "Kangore Rice 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 180,
    image: "/images/products/kangore-rice.jpg",
    category: "Grains",
    stock: 100
  },


  {
    name: "Shindano Rice 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 160,
    image: "/images/products/shindano-rice.jpg",
    category: "Grains",
    stock: 100
  },


  {
    name: "Biryani Rice 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 140,
    image: "/images/products/biryani-rice.jpg",
    category: "Grains",
    stock: 100
  },

  {
    name: "Lentils (Kamande) 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 250,
    image: "/images/products/lentils.jpg",
    category: "Grains",
    stock: 100
  },

  {
    name: "Chana dal 1kg",
    description: "Pure, nutritious grains with great taste and quality",
    price: 190,
    image: "/images/products/chana dal.jpg",
    category: "Grains",
    stock: 100
  },

  {
    name: "Salt 500g",
    description: "Premium quality Sea Salt",
    price: 25,
    image: "/images/products/salt.jpg",
    category: "Other",
    stock: 100
  },

  {
    name: "Njugu Karanga Kubwa 1kg",
    description: "Premium-quality, naturally sourced cereals",
    price: 330,
    image: "/images/products/njugu-kubwa.jpg",
    category: "Cereals",
    stock: 100
  },

  {
    name: "Ndengu 1kg",
    description: "Fresh green grams, protein-rich legume",
    price: 180,
    image: "/images/products/ndengu.jpg",
    category: "Grains",
    stock: 75
  },

  {
    name: "Black Pepper",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/black.jpg",
    category: "Spices",
    stock: 22
  },


{
    name: "Red Chilli Powder",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/chilli.jpg",
    category: "Spices",
    stock: 22
  },


  {
    name: "Curry Powder",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/curry.jpg",
    category: "Spices",
    stock: 22
  },

  {
    name: "Tumeric",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/Tumeric.jpg",
    category: "Spices",
    stock: 30
  },

  {
    name: "Garam masala",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/Garam.jpg",
    category: "Spices",
    stock: 0
  },


  {
    name: "Cloves",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/Cloves.jpg",
    category: "Spices",
    stock: 30
  },

   {
    name: "Chia Seeds",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/Chia.jpg",
    category: "Spices",
    stock: 30
  },


  {
    name: "Moringa",
    description: "Aromatic spices, rich in flavor and health-boosting compounds",
    price: 180,
    image: "/images/products/moringa.jpg",
    category: "Spices",
    stock: 30
  },


  {
    name: "Fahari ya Kenya 15g",
    description: "Premium Kenya tea leaves",
    price: 10,
    image: "/images/products/fahari.jpg",
    category: "Beverages",
    stock: 90
  },

   {
    name: "Fahari ya Kenya Tangawizi 15g",
    description: "Premium Kenya tea leaves",
    price: 10,
    image: "/images/products/fahari-tangawizi.jpg",
    category: "Beverages",
    stock: 40
  },

  {
    name: "MacCoffee 1.6g",
    description: "Rich aromatic instant coffee",
    price: 10,
    image: "/images/products/maccoffee.jpg",
    category: "Beverages",
    stock: 40
  },

  {
    name: "Nescafe Classic 1.5g",
    description: "Full & Bold Flavour",
    price: 10,
    image: "/images/products/nescafe-classic.jpg",
    category: "Beverages",
    stock: 40
  },

   {
    name: "Nescafe Creamy White 18g",
    description: "Full & Bold Flavour",
    price: 30,
    image: "/images/products/nescafe-creamy.jpg",
    category: "Beverages",
    stock: 40
  },


  {
    name: "Raha Drinking Chocolate 20g",
    description: "Taste the raha warmth",
    price: 30,
    image: "/images/products/raha.jpg",
    category: "Beverages",
    stock: 40
  },


  {
    name: "Ameru Peanuts Coated 60g",
    description: "Roasted, coated and salted peanuts",
    price: 30,
    image: "/images/products/peanuts.jpg",
    category: "Snacks",
    stock: 85
  },

  {
    name: "Ameru Peanuts Coated 20g",
    description: "Roasted, coated and salted peanuts",
    price: 20,
    image: "/images/products/ameru-peanuts.jpg",
    category: "Snacks",
    stock: 85
  },

  {
    name: "Potato Crisps",
    description: "Crispy flavored potato chips",
    price: 120,
    image: "/images/products/potato-crisps.jpg",
    category: "Snacks",
    stock: 120
  },

  {
    name: "Cooking Oil 2L",
    description: "Pure vegetable cooking oil",
    price: 680,
    image: "/images/products/cooking-oil.jpg",
    category: "Other",
    stock: 60
  },


  {
    name: "Wheat Flour 2kg",
    description: "Fortified All Purpose Home Baking Wheat Flour",
    price: 180,
    image: "/images/products/ajab.jpg",
    category: "Other",
    stock: 60
  },


  {
    name: "Wimbi 1kg",
    description: "Unga wa uji",
    price: 140,
    image: "/images/products/wimbi.jpg",
    category: "Other",
    stock: 60
  },

  {
    name: "Mtama 1kg",
    description: "Unga wa uji",
    price: 140,
    image: "/images/products/mtama.jpg",
    category: "Other",
    stock: 60
  },


  {
    name: "Muhogo 1kg",
    description: "Unga wa uji(Porridge Flour)",
    price: 140,
    image: "/images/products/muhogo.jpg",
    category: "Other",
    stock: 60
  },

 {
    name: "Mawere 1kg",
    description: "Unga wa Uji(Porridge Flour)",
    price: 140,
    image: "/images/products/mawere.jpg",
    category: "Other",
    stock: 60
  },

  {
    name: "Baridi 1kg",
    description: "Unga wa uji",
    price: 140,
    image: "/images/products/baridi.jpg",
    category: "Other",
    stock: 60
  },

  {
    name: "Ndimu 1kg",
    description: "Unga wa uji(Porridge Flour)",
    price: 140,
    image: "/images/products/ndimu.jpg",
    category: "Other",
    stock: 60
  },

  {
    name: "Unga wa ugali N0.1 1kg",
    description: "Maize meal No.1",
    price: 100,
    image: "/images/products/maize-flour.jpg",
    category: "Other",
    stock: 60
  },


  {
    name: "Raha Premium 2kg",
    description: "Raha Premium",
    price: 220,
    image: "/images/products/Raha-Premium.jpg",
    category: "Other",
    stock: 60
  },

  {
    name: "Soko Maize meal 2kg",
    description: "Maize meal",
    price: 170,
    image: "/images/products/maize-flour.jpg",
    category: "Other",
    stock: 60
  },

  {
    name: "Sugar 2kg",
    description: "White refined sugar",
    price: 360,
    image: "/images/products/sugar.jpg",
    category: "Other",
    stock: 150
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Product.deleteMany();
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('✅ 10 Products added successfully!');

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedProducts();
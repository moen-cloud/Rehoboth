import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

// Map of seed-script base filename -> real Cloudinary URL
// (keys match the filename used in seedProducts.js, without extension)
const imageMap = {
  "maize-flour": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142890/maize-flour_wv4guq.jpg",
  "salt": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142885/salt_bbemsx.jpg",
  "yellow-beans": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142881/yellow-beans_ronjml.jpg",
  "wairimu-beans": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142880/wairimu-beans_bj6lcw.jpg",
  "Tumeric": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142879/Tumeric_eie87k.jpg",
  "sugar": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142879/sugar_lqeiad.jpg",
  "shindano-rice": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142878/shindano-rice_w8jvzp.jpg",
  "raha": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142877/raha_osk4gr.jpg",
  "rosecoco": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142876/rosecoco_sdrstc.jpg",
  "popcorn": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142875/popcorn_icbgmo.jpg",
  "Raha-Premium": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142875/Raha-Premium_vnmy0n.jpg",
  "nescafe-classic": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142875/nescafe-classic_sbrjm5.png",
  "pishori-rice": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142873/pishori-rice_k3qg72.jpg",
  "peanuts": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142872/peanuts_vbrf3o.jpg",
  "nyayo-beans": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142871/nyayo-beans_pnpf0k.jpg",
  "njahi": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142869/njahi_gvwupg.jpg",
  "njugu-small": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142869/njugu-small_zoth3w.jpg",
  "moringa": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142868/moringa_wm8fer.jpg",
  "ndengu": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142868/ndengu_rewrk3.jpg",
  "mbaazi-red": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142867/mbaazi-red_kgdex5.jpg",
  "maccoffee": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142863/maccoffee_gsiw3q.jpg",
  "lentils": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142863/lentils_rj6fcd.jpg",
  "karanga-white": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142863/karanga-white_nsxisj.jpg",
  "karanga-kubwa": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142862/karanga-kubwa_minusz.jpg",
  "njugu-kubwa": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142862/karanga-kubwa_minusz.jpg", // duplicate item in seed file, reuses karanga-kubwa image
  "kangore-rice": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142861/kangore-rice_ye3x3y.jpg",
  "Garam": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142860/Garam_bahnst.jpg",
  "fahari-tangawizi": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142859/fahari-tangawizi_tloodq.jpg",
  "fahari": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142858/fahari_qmdea7.jpg",
  "curry": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142854/curry_uot71j.jpg",
  "cream-pinto-beans": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142853/cream-pinto-beans_eqxupl.jpg",
  "Chia": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142853/Chia_xccjd4.jpg",
  "Cloves": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142853/Cloves_wvezbr.jpg",
  "chilli": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142853/chilli_dnme6g.jpg",
  "chana dal": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142853/chana_dal_avab10.jpg",
  "biryani-rice": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142852/biryani-rice_vqw7ir.jpg",
  "basmati-rice": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142852/basmati-rice_qnwbp2.jpg",
  "army-beans": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142852/army-beans_wwpb4c.jpg",
  "black": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142852/black_r8tpxk.jpg",
  "brown-rice": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142852/brown-rice_zung2u.jpg",
  "ajab": "https://res.cloudinary.com/debhmwj73/image/upload/v1773142851/ajab_zwnm7q.jpg",
};

// Extracts the base filename (no folder path, no extension) from the
// existing /images/products/xxx.jpg style string stored in the DB
const getBaseName = (imagePath) => {
  const fileWithExt = imagePath.split('/').pop(); // e.g. "army-beans.jpg"
  return fileWithExt.replace(/\.[^/.]+$/, ''); // strip extension -> "army-beans"
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const allProducts = await Product.find();
    console.log(`Found ${allProducts.length} products`);

    let updatedCount = 0;
    let skippedCount = 0;
    const skipped = [];

    for (const product of allProducts) {
      const baseName = getBaseName(product.image);
      const newUrl = imageMap[baseName];

      if (newUrl) {
        product.image = newUrl;
        await product.save();
        updatedCount++;
      } else {
        skippedCount++;
        skipped.push({ name: product.name, image: product.image });
      }
    }

    console.log(`\n Updated ${updatedCount} products with Cloudinary URLs`);
    if (skippedCount > 0) {
      console.log(`  Skipped ${skippedCount} products (no matching Cloudinary upload found):`);
      skipped.forEach(p => console.log(`   - ${p.name} (${p.image})`));
      console.log('\nUpload these to Cloudinary and add them to imageMap to fix.');
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateImages();
/**
 * Migration script to fix product image URLs
 * Converts old public URLs to new signed URLs
 * Run with: npx tsx scripts/fix-product-image-urls.ts
 */

import prisma from "../lib/prisma";
import { getSignedUrl } from "../lib/upload";

async function fixProductImageUrls() {
  console.log("🔄 Starting product image URL migration...\n");

  try {
    // Get all products with image URLs
    const products = await prisma.printProduct.findMany({
      where: {
        image_url: {
          not: null,
        },
      },
      include: {
        variations: true,
      },
    });

    console.log(`📦 Found ${products.length} products with images\n`);

    let updatedProducts = 0;
    let updatedVariations = 0;

    for (const product of products) {
      let productUpdated = false;

      // Fix product image if it's a public URL
      if (product.image_url && product.image_url.includes("/object/public/")) {
        console.log(`  Fixing product: ${product.name}`);
        
        // Extract path from URL
        const urlObj = new URL(product.image_url);
        const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
        
        if (match && match[1]) {
          const path = match[1];
          console.log(`    Path: ${path}`);
          
          // Generate new signed URL
          const result = await getSignedUrl(path, "image");
          
          if (result) {
            await prisma.printProduct.update({
              where: { id: product.id },
              data: { image_url: result.signedUrl },
            });
            console.log(`    ✅ Updated product image`);
            productUpdated = true;
            updatedProducts++;
          } else {
            console.log(`    ❌ Failed to generate signed URL`);
          }
        }
      }

      // Fix variation images
      for (const variation of product.variations) {
        if (variation.image_url && variation.image_url.includes("/object/public/")) {
          console.log(`    Fixing variation: ${variation.name}`);
          
          const urlObj = new URL(variation.image_url);
          const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
          
          if (match && match[1]) {
            const path = match[1];
            
            const result = await getSignedUrl(path, "image");
            
            if (result) {
              await prisma.printProductVariation.update({
                where: { id: variation.id },
                data: { image_url: result.signedUrl },
              });
              console.log(`      ✅ Updated variation image`);
              updatedVariations++;
            } else {
              console.log(`      ❌ Failed to generate signed URL`);
            }
          }
        }
      }

      if (productUpdated || updatedVariations > 0) {
        console.log("");
      }
    }

    console.log("✨ Migration complete!");
    console.log(`   Products updated: ${updatedProducts}`);
    console.log(`   Variations updated: ${updatedVariations}`);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
fixProductImageUrls();

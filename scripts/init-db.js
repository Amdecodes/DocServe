/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Initializing database for Print Orders...");
  
  try {
      // 1. Create print_products table
      console.log("Creating print_products table...");
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "print_products" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "name" TEXT NOT NULL,
          "description" TEXT,
          "base_price" DECIMAL(65,30) NOT NULL,
          "image_url" TEXT,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "print_products_pkey" PRIMARY KEY ("id")
        );
      `);
      
      // 2. Enum
      console.log("Ensuring PrintOrderStatus enum...");
      try {
        await prisma.$executeRawUnsafe(`CREATE TYPE "PrintOrderStatus" AS ENUM ('pending', 'contacted', 'completed');`);
      } catch {
        // Ignore if exists
      }

      // 3. Create print_orders table
      console.log("Creating print_orders table...");
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "print_orders" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "product_id" UUID NOT NULL,
          "product_name" TEXT NOT NULL,
          "full_name" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "email" TEXT,
          "location" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "notes" TEXT,
          "status" "PrintOrderStatus" NOT NULL DEFAULT 'pending',
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "print_orders_pkey" PRIMARY KEY ("id")
        );
      `);

      // 4. Seed products
      console.log("Checking for existing products...");
      const existing = await prisma.$queryRawUnsafe(`SELECT count(*)::int as c FROM "print_products"`);
      // Handle different return shapes of count
      // @ts-expect-error - raw query result shape varies
      const count = existing[0].c !== undefined ? existing[0].c : existing[0].count;
      
      if (Number(count) === 0) {
          console.log("Seeding products...");
          await prisma.$executeRawUnsafe(`
            INSERT INTO "print_products" (name, description, base_price, image_url)
            VALUES 
            ('Restaurant Menus', 'High-quality laminated menus, tri-fold or booklet styles.', 50, '/images/products/menu-placeholder.jpg'),
            ('Business Cards', 'Premium matte or glossy finish business cards.', 500, '/images/products/business-card-placeholder.jpg'),
            ('Flyers & Brochures', 'A5, A4 flyers for events and promotions.', 10, '/images/products/flyer-placeholder.jpg'),
            ('Wedding Invitations', 'Elegant custom designs with premium envelopes.', 50, '/images/products/wedding-placeholder.jpg'),
            ('Roll-up Banners', 'Standard 85x200cm roll-up banners with stand.', 2500, '/images/products/banner-placeholder.jpg'),
            ('Custom Stickers', 'Die-cut labels for products or branding.', 5, '/images/products/sticker-placeholder.jpg'),
            ('T-Shirt Printing', 'Cotton t-shirts with heat press or screen printing.', 400, '/images/products/tshirt-placeholder.jpg'),
            ('Custom Mugs', 'Ceramic mugs with your logo or photo.', 350, '/images/products/mug-placeholder.jpg');
          `);
          console.log("Seeded products successfully.");
      } else {
          console.log(`Products already exist (${count}). Skipping seed.`);
      }

      console.log("Done.");
  } catch (err) {
      console.error("Initialization failed:", err);
      process.exit(1);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Updating database for Variations...");

  try {
      // 1. Create print_product_variations table
      console.log("Creating print_product_variations table...");
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "print_product_variations" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "product_id" UUID NOT NULL,
          "name" TEXT NOT NULL,
          "image_url" TEXT NOT NULL,
          CONSTRAINT "print_product_variations_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "print_product_variations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "print_products"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);

      // 2. Grant permissions on new table
      console.log("Granting permissions...");
      await prisma.$executeRawUnsafe(`GRANT ALL ON TABLE "print_product_variations" TO postgres, anon, authenticated, service_role;`);

      // 3. Alter print_orders table to add variation fields
      console.log("Altering print_orders table...");
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "print_orders" ADD COLUMN IF NOT EXISTS "variation_id" UUID;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "print_orders" ADD COLUMN IF NOT EXISTS "variation_name" TEXT;`);
      } catch (e) {
        console.log("Columns likely exist or error:", e.message);
      }

      // 4. Seed Variations
      console.log("Seeding variations...");
      
      // Get Business Card Product
      const cards = await prisma.$queryRawUnsafe(`SELECT id FROM "print_products" WHERE name = 'Business Cards' LIMIT 1`);
      // @ts-ignore
      const cardId = cards[0]?.id;

      if (cardId) {
         // Check if variations exist
         const existingVars = await prisma.$queryRawUnsafe(`SELECT count(*)::int as c FROM "print_product_variations" WHERE product_id = '${cardId}'`);
         // @ts-ignore
         const count = existingVars[0].c !== undefined ? existingVars[0].c : existingVars[0].count;

         if (Number(count) === 0) {
            await prisma.$executeRawUnsafe(`
                INSERT INTO "print_product_variations" (product_id, name, image_url) VALUES 
                ('${cardId}', 'Matte Black', '/images/products/business-card-placeholder.jpg'),
                ('${cardId}', 'Glossy White', '/images/products/business-card-placeholder.jpg'),
                ('${cardId}', 'Gold Foil', '/images/products/business-card-placeholder.jpg');
            `);
            console.log("Seeded Business Card variations.");
         }
      }

      // Get T-Shirts Product
      const shirts = await prisma.$queryRawUnsafe(`SELECT id FROM "print_products" WHERE name = 'T-Shirt Printing' LIMIT 1`);
      // @ts-ignore
      const shirtId = shirts[0]?.id;

      if (shirtId) {
          const existingVars = await prisma.$queryRawUnsafe(`SELECT count(*)::int as c FROM "print_product_variations" WHERE product_id = '${shirtId}'`);
          // @ts-ignore
          const count = existingVars[0].c !== undefined ? existingVars[0].c : existingVars[0].count;

          if (Number(count) === 0) {
             await prisma.$executeRawUnsafe(`
                 INSERT INTO "print_product_variations" (product_id, name, image_url) VALUES 
                 ('${shirtId}', 'White Cotton', '/images/products/tshirt-placeholder.jpg'),
                 ('${shirtId}', 'Black Cotton', '/images/products/tshirt-placeholder.jpg'),
                 ('${shirtId}', 'Grey Heather', '/images/products/tshirt-placeholder.jpg');
             `);
             console.log("Seeded T-Shirt variations.");
          }
      }

      // Reload Schema Cache
      await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload config';`);
      console.log("Done.");

  } catch (err) {
      console.error("Update failed:", err);
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

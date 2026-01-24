const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Granting permissions...");
  try {
    // Grant usage on schema public (usually default, but good to ensure)
    await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;`);
    
    // Grant select on print_products
    await prisma.$executeRawUnsafe(`GRANT ALL ON TABLE "print_products" TO postgres, anon, authenticated, service_role;`);
    
    // Grant all on print_orders
    await prisma.$executeRawUnsafe(`GRANT ALL ON TABLE "print_orders" TO postgres, anon, authenticated, service_role;`);

    // Reload schema again just in case
    await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload config';`);

    console.log("Permissions granted and schema reload notified.");
  } catch (err) {
    console.error("Failed to grant permissions:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

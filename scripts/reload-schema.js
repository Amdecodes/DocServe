import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Reloading PostgREST schema cache...");
  try {
    await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload config';`);
    console.log("Schema cache reload notified.");
  } catch (err) {
    console.error("Failed to notify schema reload:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

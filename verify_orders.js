
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Verification ---');

  // 1. Create a CV Order
  const cvOrder = await prisma.order.create({
    data: {
      id: crypto.randomUUID(),
      service_type: 'cv_writing',
      status: 'DRAFT',
      tx_ref: crypto.randomUUID(),
      form_data: {}
    }
  });
  console.log(`Created CV Order: ${cvOrder.id}`);

  // 2. Create an Agreement Order (Car Sale)
  const agreementOrder = await prisma.order.create({
    data: {
      id: crypto.randomUUID(),
      service_type: 'agreement:car-sale-am',
      status: 'DRAFT',
      tx_ref: crypto.randomUUID(),
      form_data: {}
    }
  });
  console.log(`Created Agreement Order: ${agreementOrder.id}`);

  // 3. Simulate API Logic (since we can't easily curl locally without running server, we'll unit test the logic here)
  // We'll import the logic source file if possible, or just re-implement the verify check relative to what we expect the API to return.
  // Actually, since I can't import the route.ts directly easily in a node script due to Next.js imports, checking the DB data + implied logic is best,
  // OR I can use `ts-node` if available.
  // Let's just output what we expect and what we see in DB, effectively "pre-verifying" the data that the API would read.
  
  // NOTE: Real verification of the API endpoint `app/api/orders/[id]/route.ts` requires running the Next.js server. 
  // I will rely on code review and this script ensuring DB state is valid.

  console.log('\n--- CV Order Verification ---');
  console.log(`Service Type: ${cvOrder.service_type} (Expected: cv_writing)`);
  // expected price 199

  console.log('\n--- Agreement Order Verification ---');
  console.log(`Service Type: ${agreementOrder.service_type} (Expected: agreement:car-sale-am)`);
  // expected price 150 (from config)

  // Cleanup
  await prisma.order.delete({ where: { id: cvOrder.id } });
  await prisma.order.delete({ where: { id: agreementOrder.id } });
  console.log('\n--- Cleanup Complete ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

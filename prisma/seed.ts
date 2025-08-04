import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
    },
  });

  console.log('Created test user!');

  // Create some sample products for the test user
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'sample-product-1' },
      update: {},
      create: {
        id: 'sample-product-1',
        name: 'Laptop',
        amount: 1,
        comment: 'MacBook Pro for development',
        order: 1,
        userId: testUser.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'sample-product-2' },
      update: {},
      create: {
        id: 'sample-product-2',
        name: 'Coffee',
        amount: 5,
        comment: 'Colombian coffee beans',
        order: 2,
        userId: testUser.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'sample-product-3' },
      update: {},
      create: {
        id: 'sample-product-3',
        name: 'Notebooks',
        amount: 3,
        comment: "Spiral notebooks for notes",
        order: 3,
        userId: testUser.id,
      },
    }),
  ]);

  console.log('Created sample products:', products.length);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

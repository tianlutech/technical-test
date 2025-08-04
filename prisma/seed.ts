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
      where: { id: '8ebd311c-14c8-40e7-b2f2-3c4b46fa49ac' },
      update: {},
      create: {
        id: '8ebd311c-14c8-40e7-b2f2-3c4b46fa49ac',
        name: 'Laptop',
        amount: 1,
        comment: 'MacBook Pro for development',
        order: 1,
        userId: testUser.id,
      },
    }),
    prisma.product.upsert({
      where: { id: '779b4c46-1ca4-450a-8aed-87d4946ec4a2' },
      update: {},
      create: {
        id: '779b4c46-1ca4-450a-8aed-87d4946ec4a2',
        name: 'Coffee',
        amount: 5,
        comment: 'Colombian coffee beans',
        order: 2,
        userId: testUser.id,
      },
    }),
    prisma.product.upsert({
      where: { id: '87276ed0-acd1-4132-97de-25b2e9bd854d' },
      update: {},
      create: {
        id: '87276ed0-acd1-4132-97de-25b2e9bd854d',
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

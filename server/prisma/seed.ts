import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.record.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.weather.deleteMany();
  await prisma.user.deleteMany();

  const demoUsers = [
    { email: 'alice@example.com', name: 'Alice Farmer', password: 'Password123!' },
    { email: 'bob@example.com', name: 'Bob Grower', password: 'Password123!' },
    { email: 'carla@example.com', name: 'Carla Fields', password: 'Password123!' },
    { email: 'dan@example.com', name: 'Dan Harvester', password: 'Password123!' },
    { email: 'ella@example.com', name: 'Ella Agro', password: 'Password123!' },
    { email: 'frank@example.com', name: 'Frank Ranch', password: 'Password123!' }
  ];

  const created: Array<any> = [];
  for (const u of demoUsers) {
    const hash = await argon2.hash(u.password);
    const user = await prisma.user.create({ data: { email: u.email, password: hash, name: u.name } });
    created.push({ id: user.id, email: user.email, name: user.name, password: u.password });
  }

  console.log('Created demo users:');
  created.forEach(u => console.log(`${u.email}  /  ${u.password}`));

  const crops = ['Maize', 'Wheat', 'Soy', 'Rice', 'Barley', 'Cotton'];

  console.log('Creating sample records...');
  for (const u of created) {
    for (let i = 0; i < 6; i++) {
      await prisma.record.create({
        data: {
          userId: u.id,
          crop: crops[(i + u.id) % crops.length],
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          quantity: Math.round((Math.random() * 90 + 10) * 100) / 100,
          price: Math.round((Math.random() * 200 + 20) * 100) / 100,
          notes: `Sample record ${i + 1}`,
          location: `Field ${String.fromCharCode(65 + (i % 3))}`
        }
      });
    }
  }

  console.log('Creating market prices...');
  const now = Date.now();
  for (let i = 0; i < 12; i++) {
    await prisma.marketPrice.create({
      data: {
        crop: crops[i % crops.length],
        date: new Date(now - i * 24 * 60 * 60 * 1000),
        price: Math.round((Math.random() * 300 + 10) * 100) / 100
      }
    });
  }

  console.log('Creating weather samples...');
  const locations = ['Farmville', 'Green Acres', 'North Field'];
  for (let i = 0; i < 12; i++) {
    await prisma.weather.create({
      data: {
        location: locations[i % locations.length],
        date: new Date(now - i * 24 * 60 * 60 * 1000),
        temp: Math.round((Math.random() * 15 + 10) * 10) / 10,
        precip: Math.round((Math.random() * 10) * 10) / 10,
        notes: 'Sample weather'
      }
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

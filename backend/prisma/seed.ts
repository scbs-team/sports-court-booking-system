import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash the password properly
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  // Create a user
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: passwordHash, // Now properly hashed
      role: 'ADMIN',
    },
  });

  // Create courts
  const court1 = await prisma.court.create({
    data: { name: 'Tennis Court 1' },
  });

  const court2 = await prisma.court.create({
    data: { name: 'Tennis Court 2' },
  });

  const court3 = await prisma.court.create({
    data: { name: 'Basketball Court 1' },
  });

  console.log('✅ Seeding completed!');
  console.log(`👤 User created: ${user.username} (${user.email})`);
  console.log(`🎾 Courts created: ${court1.name}, ${court2.name}, ${court3.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  
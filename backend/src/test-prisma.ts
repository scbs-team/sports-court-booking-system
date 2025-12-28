import { prisma } from './lib/prisma';

async function main() {
  const courts = await prisma.court.findMany();
  console.log(courts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

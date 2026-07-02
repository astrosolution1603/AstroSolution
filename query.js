const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'ASTROLOGER' },
    select: { email: true, name: true }
  });
  console.log("Astrologers:", users);
}

main().finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.platformSettings.upsert({
    where: { id: "global" },
    update: { themeName: "snowfall" },
    create: { id: "global", themeName: "snowfall" },
  });
  console.log("Global theme successfully updated to:", settings.themeName);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

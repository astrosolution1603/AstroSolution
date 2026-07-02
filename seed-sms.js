const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.platformSettings.upsert({
    where: { id: "global" },
    update: { fast2smsKey: "ZmbcrgOB7s1MkRCEzPTj5NVlAXiFHI2hUntdxu6JYaLqW8wQoGZlCOyqgKe3H8s0jkIM2x51J7XFnAVo" },
    create: {
      id: "global",
      fast2smsKey: "ZmbcrgOB7s1MkRCEzPTj5NVlAXiFHI2hUntdxu6JYaLqW8wQoGZlCOyqgKe3H8s0jkIM2x51J7XFnAVo"
    }
  });
  console.log("seeded");
}
main().finally(() => prisma.$disconnect());

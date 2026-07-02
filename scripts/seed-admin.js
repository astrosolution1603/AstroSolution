const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Master Admin
  const existing = await prisma.user.findUnique({ where: { phone: '9991896001' } });
  
  if (existing) {
    // Upgrade to ADMIN if not already
    await prisma.user.update({
      where: { phone: '9991896001' },
      data: { role: 'ADMIN', profileComplete: true },
    });
    console.log('✅ Existing user upgraded to ADMIN:', existing.name);
  } else {
    const admin = await prisma.user.create({
      data: {
        name: 'Master Admin',
        phone: '9991896001',
        role: 'ADMIN',
        profileComplete: true,
      },
    });
    console.log('✅ Master Admin created:', admin.name, '| Phone:', admin.phone);
  }
  
  console.log('\n🔑 Login at /login with phone: 9991896001 and OTP: 1234');
  console.log('🔮 After login, you will be redirected to /admin');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

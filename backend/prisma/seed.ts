import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'default-org' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default-org',
    },
  });
  console.log(`🏢 Created/Verified Organization: ${org.name} (${org.id})`);

  // Create default Admin user
  const adminEmail = 'admin@example.com';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'System Admin',
      email: adminEmail,
      password: 'SuperSecretAdminPassword123!',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      organizationId: org.id,
    },
  });
  console.log(`👤 Created/Verified Admin User: ${admin.name} (${admin.email})`);

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

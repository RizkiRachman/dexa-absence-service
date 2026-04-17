import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN = {
  USER_ID: 'auth.service',
  EMPLOYEE_ID: '77f085de-ebc8-47df-b93d-a4e0624df19f',
  EMAIL: 'auth.service@dexa.com',
  PASSWORD: 'admin',
} as const;

async function main() {
  const existing = await prisma.user.findUnique({ where: { id: ADMIN.USER_ID } });
  if (existing) {
    console.log('Admin user already exists, skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN.PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      id: ADMIN.USER_ID,
      email: ADMIN.EMAIL,
      passwordHash,
      role: 'hr',
    },
  });

  await prisma.employee.create({
    data: {
      id: ADMIN.EMPLOYEE_ID,
      userId: user.id,
      departmentId: 'HR',
      name: 'Auth Service',
      displayName: 'Auth Service',
      email: ADMIN.EMAIL,
      position: 'Service Account',
      phoneNumber: '000000000000',
    },
  });

  console.log('Admin data initialized.');
}

main()
  .catch((e) => {
    console.error('Init admin data failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

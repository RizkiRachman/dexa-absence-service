import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const M2M = {
    USER_ID: 'api.gateway',
    EMPLOYEE_ID: 'a1b2c3d4-0000-0000-0000-000000000001',
    EMAIL: 'api.gateway@dexa.com',
    PASSWORD: 'api.gateway',
} as const;

async function main() {
    const existing = await prisma.user.findUnique({ where: { id: M2M.USER_ID } });
    if (existing) {
        console.log('M2M user already exists, skipping.');
        console.log('user_id    :', M2M.USER_ID);
        console.log('employee_id:', M2M.EMPLOYEE_ID);
        console.log('role       :', existing.role);
        console.log('email      :', existing.email);
        return;
    }

    const hash = await bcrypt.hash(M2M.PASSWORD, 10);

    const user = await prisma.user.create({ data: { id: M2M.USER_ID, email: M2M.EMAIL, passwordHash: hash, role: 'hr' } });
    await prisma.employee.create({ data: { id: M2M.EMPLOYEE_ID, userId: user.id, departmentId: 'HR', name: 'API Gateway', displayName: 'API Gateway', email: M2M.EMAIL, position: 'Service Account', phoneNumber: '000000000001' } });

    console.log('init-m2m-employee done.');
    console.log('user_id    :', M2M.USER_ID);
    console.log('employee_id:', M2M.EMPLOYEE_ID);
    console.log('role       :', 'hr');
    console.log('email      :', M2M.EMAIL);
    console.log('password   :', M2M.PASSWORD);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

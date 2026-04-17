import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('password', 10);

    const u1 = await prisma.user.create({ data: { email: 'hendra.gunawan@dexa.com', passwordHash: hash, role: 'hr' } });
    await prisma.employee.create({ data: { userId: u1.id, departmentId: 'HR', name: 'Hendra Gunawan', displayName: 'Hendra', email: u1.email, position: 'HR Manager', phoneNumber: '081300000010' } });

    const u2 = await prisma.user.create({ data: { email: 'maya.putri@dexa.com', passwordHash: hash, role: 'hr' } });
    await prisma.employee.create({ data: { userId: u2.id, departmentId: 'HR', name: 'Maya Putri', displayName: 'Maya', email: u2.email, position: 'HR Staff', phoneNumber: '081300000011' } });

    console.log('init-hr-employee done.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

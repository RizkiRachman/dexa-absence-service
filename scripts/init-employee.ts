import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const dayOffset = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
};

async function main() {
    const hash = await bcrypt.hash('password', 10);

    const u1 = await prisma.user.create({ data: { email: 'raka.pratama@dexa.com', passwordHash: hash, role: 'employee' } });
    const e1 = await prisma.employee.create({ data: { userId: u1.id, departmentId: 'IT', name: 'Raka Pratama', displayName: 'Raka', email: u1.email, position: 'Backend Engineer', phoneNumber: '081300000001' } });

    const u2 = await prisma.user.create({ data: { email: 'layla.nur@dexa.com', passwordHash: hash, role: 'employee' } });
    const e2 = await prisma.employee.create({ data: { userId: u2.id, departmentId: 'FINANCE', name: 'Layla Nur', displayName: 'Layla', email: u2.email, position: 'Finance Analyst', phoneNumber: '081300000002' } });

    const u3 = await prisma.user.create({ data: { email: 'dimas.arya@dexa.com', passwordHash: hash, role: 'employee' } });
    const e3 = await prisma.employee.create({ data: { userId: u3.id, departmentId: 'MARKETING', name: 'Dimas Arya', displayName: 'Dimas', email: u3.email, position: 'Marketing Specialist', phoneNumber: '081300000003' } });

    const u4 = await prisma.user.create({ data: { email: 'sari.indah@dexa.com', passwordHash: hash, role: 'employee' } });
    const e4 = await prisma.employee.create({ data: { userId: u4.id, departmentId: 'SALES', name: 'Sari Indah', displayName: 'Sari', email: u4.email, position: 'Sales Executive', phoneNumber: '081300000004' } });

    await prisma.absence.create({ data: { employeeId: e1.id, date: dayOffset(0), checkInTime: new Date('1970-01-01T08:00:00'), checkOutTime: new Date('1970-01-01T17:00:00') } });
    await prisma.absence.create({ data: { employeeId: e1.id, date: dayOffset(-1), checkInTime: new Date('1970-01-01T08:10:00'), checkOutTime: new Date('1970-01-01T17:05:00') } });

    await prisma.absence.create({ data: { employeeId: e2.id, date: dayOffset(0), checkInTime: new Date('1970-01-01T07:55:00'), checkOutTime: new Date('1970-01-01T17:00:00') } });

    const leave1 = await prisma.leaveRequest.create({ data: { employeeId: e3.id, type: 'sick', startDate: dayOffset(1), endDate: dayOffset(2), status: 'pending', notes: 'Demam' } });
    for (let i = 1; i <= 2; i++) await prisma.absence.create({ data: { employeeId: e3.id, date: dayOffset(i), leaveRequestId: leave1.id } });
    await prisma.pendingTask.create({ data: { leaveRequestId: leave1.id, requestedBy: e3.id, status: 'pending' } });

    const leave2 = await prisma.leaveRequest.create({ data: { employeeId: e4.id, type: 'annual_leave', startDate: dayOffset(3), endDate: dayOffset(5), status: 'pending', notes: 'Cuti tahunan' } });
    for (let i = 3; i <= 5; i++) await prisma.absence.create({ data: { employeeId: e4.id, date: dayOffset(i), leaveRequestId: leave2.id } });
    await prisma.pendingTask.create({ data: { leaveRequestId: leave2.id, requestedBy: e4.id, status: 'pending' } });

    console.log('init-employee done.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

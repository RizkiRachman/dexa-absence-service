import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash('admin', 10);

  // HR Admin
  const hrUser = await prisma.user.create({
    data: { email: 'siti.rahayu@dexa.com', passwordHash: defaultPassword, role: 'hr' },
  });
  const hrEmployee = await prisma.employee.create({
    data: {
      userId: hrUser.id,
      departmentId: 'HR',
      name: 'Siti Rahayu',
      displayName: 'Siti',
      email: 'siti.rahayu@dexa.com',
      position: 'Manajer SDM',
      phoneNumber: '081234567890',
    },
  });

  // IT
  const itUser1 = await prisma.user.create({
    data: { email: 'budi.santoso@dexa.com', passwordHash: defaultPassword, role: 'employee' },
  });
  const itEmployee1 = await prisma.employee.create({
    data: {
      userId: itUser1.id,
      departmentId: 'IT',
      name: 'Budi Santoso',
      displayName: 'Budi',
      email: 'budi.santoso@dexa.com',
      position: 'Rekayasa Perangkat Lunak',
      phoneNumber: '081234567891',
    },
  });

  const itUser2 = await prisma.user.create({
    data: { email: 'dewi.lestari@dexa.com', passwordHash: defaultPassword, role: 'employee' },
  });
  const itEmployee2 = await prisma.employee.create({
    data: {
      userId: itUser2.id,
      departmentId: 'IT',
      name: 'Dewi Lestari',
      displayName: 'Dewi',
      email: 'dewi.lestari@dexa.com',
      position: 'Analis Sistem',
      phoneNumber: '081234567892',
    },
  });

  // Finance
  const finUser1 = await prisma.user.create({
    data: { email: 'agus.wijaya@dexa.com', passwordHash: defaultPassword, role: 'employee' },
  });
  const finEmployee1 = await prisma.employee.create({
    data: {
      userId: finUser1.id,
      departmentId: 'FINANCE',
      name: 'Agus Wijaya',
      displayName: 'Agus',
      email: 'agus.wijaya@dexa.com',
      position: 'Staf Akuntansi',
      phoneNumber: '081234567893',
    },
  });

  // Marketing
  const mktUser1 = await prisma.user.create({
    data: { email: 'rina.maulida@dexa.com', passwordHash: defaultPassword, role: 'employee' },
  });
  const mktEmployee1 = await prisma.employee.create({
    data: {
      userId: mktUser1.id,
      departmentId: 'MARKETING',
      name: 'Rina Maulida',
      displayName: 'Rina',
      email: 'rina.maulida@dexa.com',
      position: 'Spesialis Pemasaran Digital',
      phoneNumber: '081234567894',
    },
  });

  // Sales
  const slsUser1 = await prisma.user.create({
    data: { email: 'ahmad.hidayat@dexa.com', passwordHash: defaultPassword, role: 'employee' },
  });
  const slsEmployee1 = await prisma.employee.create({
    data: {
      userId: slsUser1.id,
      departmentId: 'SALES',
      name: 'Ahmad Hidayat',
      displayName: 'Ahmad',
      email: 'ahmad.hidayat@dexa.com',
      position: 'Eksekutif Penjualan',
      phoneNumber: '081234567895',
    },
  });

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const dayOffset = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return fmt(d);
  };

  // Budi today
  await prisma.absence.create({
    data: {
      employeeId: itEmployee1.id,
      date: new Date(dayOffset(0)),
      checkInTime: new Date('1970-01-01T08:00:00'),
      checkOutTime: new Date('1970-01-01T17:00:00'),
      notes: 'Hadir normal',
    },
  });

  // Budi yesterday
  await prisma.absence.create({
    data: {
      employeeId: itEmployee1.id,
      date: new Date(dayOffset(-1)),
      checkInTime: new Date('1970-01-01T08:15:00'),
      checkOutTime: null,
    },
  });

  // Dewi today
  await prisma.absence.create({
    data: {
      employeeId: itEmployee2.id,
      date: new Date(dayOffset(0)),
      checkInTime: new Date('1970-01-01T08:30:00'),
      checkOutTime: new Date('1970-01-01T17:15:00'),
    },
  });

  // Agus today
  await prisma.absence.create({
    data: {
      employeeId: finEmployee1.id,
      date: new Date(dayOffset(0)),
      checkInTime: new Date('1970-01-01T07:45:00'),
      checkOutTime: new Date('1970-01-01T16:30:00'),
      notes: 'Pulang lebih awal karena ada keperluan keluarga',
    },
  });

  // Rina sick leave
  const rinaSickLeave = await prisma.leaveRequest.create({
    data: {
      employeeId: mktEmployee1.id,
      type: 'sick',
      startDate: new Date(dayOffset(1)),
      endDate: new Date(dayOffset(2)),
      status: 'pending',
      notes: 'Demam dan flu berat',
    },
  });
  for (let i = 1; i <= 2; i++) {
    await prisma.absence.create({
      data: {
        employeeId: mktEmployee1.id,
        date: new Date(dayOffset(i)),
        leaveRequestId: rinaSickLeave.id,
      },
    });
  }
  await prisma.pendingTask.create({
    data: {
      leaveRequestId: rinaSickLeave.id,
      requestedBy: mktEmployee1.id,
      status: 'pending',
    },
  });

  // Ahmad WFH
  const ahmadWfhLeave = await prisma.leaveRequest.create({
    data: {
      employeeId: slsEmployee1.id,
      type: 'wfh',
      startDate: new Date(dayOffset(-3)),
      endDate: new Date(dayOffset(-1)),
      status: 'approved',
      notes: 'Bekerja dari rumah karena renovasi kantor',
    },
  });
  for (let i = -3; i <= -1; i++) {
    await prisma.absence.create({
      data: {
        employeeId: slsEmployee1.id,
        date: new Date(dayOffset(i)),
        leaveRequestId: ahmadWfhLeave.id,
      },
    });
  }
  await prisma.pendingTask.create({
    data: {
      leaveRequestId: ahmadWfhLeave.id,
      requestedBy: slsEmployee1.id,
      reviewedBy: hrEmployee.id,
      status: 'approved',
      hrNotes: 'Disetujui, sesuai kebijakan WFH',
      reviewedAt: new Date(),
    },
  });

  // Budi annual leave
  const budiAnnualLeave = await prisma.leaveRequest.create({
    data: {
      employeeId: itEmployee1.id,
      type: 'annual_leave',
      startDate: new Date(dayOffset(5)),
      endDate: new Date(dayOffset(9)),
      status: 'pending',
      notes: 'Cuti tahunan untuk liburan keluarga ke Bali',
    },
  });
  for (let i = 5; i <= 9; i++) {
    await prisma.absence.create({
      data: {
        employeeId: itEmployee1.id,
        date: new Date(dayOffset(i)),
        leaveRequestId: budiAnnualLeave.id,
      },
    });
  }
  await prisma.pendingTask.create({
    data: {
      leaveRequestId: budiAnnualLeave.id,
      requestedBy: itEmployee1.id,
      status: 'pending',
    },
  });

  // Dewi sick leave
  const dewiSickLeave = await prisma.leaveRequest.create({
    data: {
      employeeId: itEmployee2.id,
      type: 'sick',
      startDate: new Date(dayOffset(-5)),
      endDate: new Date(dayOffset(-5)),
      status: 'rejected',
      notes: 'Sakit kepala',
    },
  });
  await prisma.absence.create({
    data: {
      employeeId: itEmployee2.id,
      date: new Date(dayOffset(-5)),
      leaveRequestId: dewiSickLeave.id,
    },
  });
  await prisma.pendingTask.create({
    data: {
      leaveRequestId: dewiSickLeave.id,
      requestedBy: itEmployee2.id,
      reviewedBy: hrEmployee.id,
      status: 'rejected',
      hrNotes: 'Ditolak, tidak disertai surat keterangan dokter',
      reviewedAt: new Date(),
    },
  });

  console.log('Init data complete.');
}

main()
  .catch((e) => {
    console.error('Init data failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

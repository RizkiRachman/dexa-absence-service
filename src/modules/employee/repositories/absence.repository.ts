import prisma from '@/lib/db';
import {LeaveStatus} from "@prisma/client";
import {AbsenceCreateData, AbsenceUpdateData, LeaveRequestCreateData} from "@/modules/employee/dtos/absences.dto";

export const absenceRepository = {

    findAbsences(
        employeeId: string,
        filters: { startDate?: Date; endDate?: Date } = {}
    ) {
        return prisma.absence.findMany({
            where: {
                employeeId,
                ...(filters.startDate && {date: {gte: filters.startDate}}),
                ...(filters.endDate && {date: {lte: filters.endDate}}),
            },
            include: {leaveRequest: true},
            orderBy: {date: 'desc'},
        });
    },

    findAbsenceById(id: string) {
        return prisma.absence.findUnique({
            where: {id},
            include: {leaveRequest: true},
        });
    },

    findAbsenceByEmployeeIdByDate(employeeId: string, date: Date) {
        return prisma.absence.findFirst({where: {employeeId, date}});
    },

    findAbsenceByLeaveRequestId(leaveRequestId: string) {
        return prisma.absence.findMany({
            where: {leaveRequestId},
            include: {leaveRequest: true}
        });
    },

    isLeaveAbsenceAlreadyExistByEmployeeIdByDateRange(employeeId: string, startDate: Date, endDate: Date) {
        return prisma.absence.findFirst({
            where: {
                employeeId,
                date: {gte: startDate, lte: endDate},
                checkInTime: null,
                checkOutTime: null
            }
        });
    },

    isLeaveRequestAlreadyExist(employeeId: string, startDate: Date, endDate: Date) {
        return prisma.absence.findFirst({
            where: {employeeId, date: {gte: startDate, lte: endDate}, leaveRequestId: {not: null}}
        });
    },

    create(data: AbsenceCreateData) {
        return prisma.absence.create({data});
    },

    createMany(data: AbsenceCreateData[]) {
        return prisma.absence.createMany({data});
    },

    update(data: AbsenceUpdateData) {
        return prisma.absence.update({where: {id: data.id, employeeId: data.employeeId}, data});
    },

    deleteById(id: string) {
        return prisma.absence.delete({where: {id}});
    },

    deleteByLeaveRequestId(leaveRequestId: string) {
        return prisma.absence.deleteMany({where: {leaveRequestId}});
    },
};

export const leaveRequestRepository = {

    findById(id: string) {
        return prisma.leaveRequest.findUnique({
            where: {id},
            include: {absences: true, pendingTask: true},
        });
    },

    findByEmployeeId(employeeId: string) {
        return prisma.leaveRequest.findMany({
            where: {employeeId},
            include: {absences: true},
            orderBy: {createdAt: 'desc'},
        });
    },

    create(data: LeaveRequestCreateData) {
        return prisma.leaveRequest.create({data});
    },

    updateStatus(id: string, status: LeaveStatus) {
        return prisma.leaveRequest.update({
            where: {id},
            data: {status},
        });
    },

    deletePendingTaskByLeaveRequestId(leaveRequestId: string) {
        return prisma.pendingTask.deleteMany({where: {leaveRequestId}});
    },

    deleteByLeaveRequestId(id: string) {
        return prisma.leaveRequest.delete({where: {id}});
    },
};

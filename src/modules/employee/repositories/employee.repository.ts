import prisma from '@/lib/db';
import {CreateEmployeeData, UpdateProfileInput} from '../dtos/profiles.dto';
import {PaginationParams} from "@/shared/dtos/pagination";

export const employeeRepository = {

    findAll(params: PaginationParams) {
        return prisma.employee.findMany({
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                position: true,
                departmentId: true,
                email: true,
                isDeleted: true
            }
        });
    },

    count() {
        return prisma.employee.count();
    },

    findByUserId(userId: string) {
        return prisma.employee.findFirst({
            where: {userId, isDeleted: false},
        });
    },

    findById(employeeId: string) {
        return prisma.employee.findFirst({
            where: {id: employeeId, isDeleted: false},
        });
    },

    updateProfile(employeeId: string, data: UpdateProfileInput) {
        return prisma.employee.update({
            where: {id: employeeId},
            data: {
                ...(data.phoneNumber && {phoneNumber: data.phoneNumber}),
                ...(data.profilePic && {profilePic: data.profilePic}),
            },
        });
    },

    createPendingTask(leaveRequestId: string, requestedBy: string) {
        return prisma.pendingTask.create({
            data: {leaveRequestId, requestedBy},
        });
    },

    updatePassword(userId: string, passwordHash: string) {
        return prisma.user.update({
            where: {id: userId},
            data: {passwordHash},
        });
    },

    createEmployee(userId: string, data: CreateEmployeeData) {
        return prisma.employee.create({data: {...data.employee, userId}})
    },

    createUser(data: CreateEmployeeData) {
        return prisma.user.create({data: data.user})
    },

    softDeleteUser(userId: string) {
        return prisma.user.update({where: {id: userId}, data: {isActive: false}});
    },

    softDeleteEmployee(employeeId: string) {
        return prisma.employee.update({where: {id: employeeId}, data: {isDeleted: true}});
    },
};

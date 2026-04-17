import {Prisma} from '.prisma/logging-client';
import {ActivityLogInsert, ActivityLogRecord} from "@/modules/activity-log/dtos/activity-log.dto";
import loggingPrisma from "@/lib/logging-db";

export const activityLogRepository = {
    async insert(request: ActivityLogInsert): Promise<void> {
        await loggingPrisma.activityLog.create({
            data: {
                ...request,
                dataBefore: request.dataBefore ?? Prisma.JsonNull,
                dataAfter: request.dataAfter ?? Prisma.JsonNull,
            }
        });
    },

    async findByEmployeeId(employeeId: string, skip: number, take: number): Promise<ActivityLogRecord[]> {
        return loggingPrisma.activityLog.findMany({
            where: {employeeId},
            orderBy: {createdAt: 'desc'},
            skip,
            take,
        }) as Promise<ActivityLogRecord[]>;
    },

    async countByEmployeeId(employeeId: string): Promise<number> {
        return loggingPrisma.activityLog.count({
            where: {employeeId},
        });
    },
}
import {
    ActivityLogRequest,
    ActivityLogResponse,
    buildActivityLogInsert,
    buildActivityLogResponse
} from '@/modules/activity-log/dtos/activity-log.dto';
import {buildPaginatedResult, PaginationParams} from "@/shared/dtos/pagination";
import {activityLogRepository} from "@/modules/activity-log/repositories/activity-log.repository";

export const activityLogService = {
    async insertActivityLog(request: ActivityLogRequest): Promise<void> {
        await activityLogRepository.insert(buildActivityLogInsert(request));
    },

    async getActivityLogs(employeeId: string, params: PaginationParams) {
        const [records, count] = await Promise.all([
            activityLogRepository.findByEmployeeId(employeeId, params.skip, params.take),
            activityLogRepository.countByEmployeeId(employeeId),
        ]);

        const data: ActivityLogResponse[] = records.map(buildActivityLogResponse);
        return buildPaginatedResult(data, count, params.page, params.limit);
    }
}
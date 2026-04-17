import {AuthenticatedRequest} from "@/shared/dtos/dto";
import {NextApiResponse} from "next";
import {getPaginationParams, PaginationParams} from "@/shared/dtos/pagination";
import {okWithPagination} from "@/shared/dtos/response";
import {activityLogService} from "@/modules/activity-log/services/activity-log.service";

export const activityLogController = {

    /**
     * GET /api/employees/:employeeId/activity-logs
     */
    async getActivityLogs(req: AuthenticatedRequest, res: NextApiResponse) {
        const employeeId = req.user.employee_id
        const filters = getPaginationParams(req.query) as PaginationParams;
        const response = await activityLogService.getActivityLogs(employeeId, filters);
        return okWithPagination(res, response);
    },
}

import {requireSameEmployeeIdOrHRDepartmentAccessHandler} from "@/shared/middleware/employee-access.middleware";
import {AuthenticatedRequest} from "@/shared/dtos/dto";
import {NextApiResponse} from "next";
import {RequestMethod} from "@/shared/constants/requestMethod";
import {methodNotAllowed} from "@/shared/dtos/response";
import {activityLogController} from "@/modules/activity-log/controllers/activity-log.controller";

export default requireSameEmployeeIdOrHRDepartmentAccessHandler((req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === RequestMethod.GET) return activityLogController.getActivityLogs(req, res);
    return methodNotAllowed(res);
});
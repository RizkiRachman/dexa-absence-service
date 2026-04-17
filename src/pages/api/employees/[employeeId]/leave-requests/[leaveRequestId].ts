import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {requireSameEmployeeIdOrHRDepartmentAccessHandler} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";
import {employeeAbsenceController} from "@/modules/employee/controllers/absence.controller";

export default requireSameEmployeeIdOrHRDepartmentAccessHandler((req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === RequestMethod.DELETE) return employeeAbsenceController.deleteLeaveRequest(req, res);
    return methodNotAllowed(res);
});

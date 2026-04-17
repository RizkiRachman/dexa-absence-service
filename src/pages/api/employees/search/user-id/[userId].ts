import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {requireSameEmployeeIdOrHRDepartmentAccessHandler} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";
import {employeeController} from "@/modules/employee/controllers/employee.controller";

export default requireSameEmployeeIdOrHRDepartmentAccessHandler((req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === RequestMethod.GET) return employeeController.getEmployeeByUserId(req, res);
    return methodNotAllowed(res);
});

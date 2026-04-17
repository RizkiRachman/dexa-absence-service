import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {employeeController} from '@/modules/employee/controllers/employee.controller';
import {requireHRDepartmentAccessHandler} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";

export default requireHRDepartmentAccessHandler((req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === RequestMethod.GET) return employeeController.getEmployeesDetails(req, res);
    if (req.method === RequestMethod.POST) return employeeController.createEmployee(req, res);
    return methodNotAllowed(res);
});

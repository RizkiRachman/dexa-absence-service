import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {employeeController} from '@/modules/employee/controllers/employee.controller';
import {requireSameEmployeeIdAccessHandler} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";

export default requireSameEmployeeIdAccessHandler((req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === RequestMethod.PUT) return employeeController.changePassword(req, res);
    return methodNotAllowed(res);
});

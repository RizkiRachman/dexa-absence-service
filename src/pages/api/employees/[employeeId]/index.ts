import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {
    requireHRDepartmentAccessHandler,
    requireSameEmployeeIdOrHRDepartmentAccessHandler
} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";
import {employeeProfileController} from "@/modules/employee/controllers/profile.controller";
import {employeeController} from "@/modules/employee/controllers/employee.controller";

const getOrUpdate = requireSameEmployeeIdOrHRDepartmentAccessHandler(
    (req: AuthenticatedRequest, res: NextApiResponse) => {
        if (req.method === RequestMethod.GET) return employeeProfileController.getProfile(req, res);
        if (req.method === RequestMethod.PUT) return employeeProfileController.updateProfile(req, res);
        return methodNotAllowed(res);
    }
);

const deleteEmployee = requireHRDepartmentAccessHandler(
    (req: AuthenticatedRequest, res: NextApiResponse) => employeeController.deleteEmployee(req, res)
);

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === RequestMethod.DELETE) return deleteEmployee(req, res);
    return getOrUpdate(req, res);
}

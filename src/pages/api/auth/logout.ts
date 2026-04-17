import type {NextApiRequest, NextApiResponse} from 'next';
import {authController} from '@/modules/auth/controllers/auth.controller';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";
import {requireSameEmployeeIdOrHRDepartmentAccessHandler} from "@/shared/middleware/employee-access.middleware";

export default requireSameEmployeeIdOrHRDepartmentAccessHandler((req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === RequestMethod.POST) return authController.logout(req, res);
    return methodNotAllowed(res);
});

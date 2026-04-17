import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {
    requireSameEmployeeIdAccessHandler,
    requireSameEmployeeIdOrHRDepartmentAccessHandler
} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";
import {employeeAbsenceController} from "@/modules/employee/controllers/absence.controller";

const get = requireSameEmployeeIdOrHRDepartmentAccessHandler(
    async (req: AuthenticatedRequest, res: NextApiResponse) => employeeAbsenceController.getAbsences(req, res)
);

const createOrUpdate = requireSameEmployeeIdAccessHandler(
    async (req: AuthenticatedRequest, res: NextApiResponse) => employeeAbsenceController.createOrUpdate(req, res)
);

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === RequestMethod.GET) return get(req, res);
    if (req.method === RequestMethod.POST) return createOrUpdate(req, res);
    return methodNotAllowed(res);
}

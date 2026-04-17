import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {
    requireHRDepartmentAccessHandler,
    requireSameEmployeeIdOrHRDepartmentAccessHandler
} from '@/shared/middleware/employee-access.middleware';
import {methodNotAllowed} from '@/shared/dtos/response';
import {RequestMethod} from "@/shared/constants/requestMethod";
import {employeeAbsenceController} from "@/modules/employee/controllers/absence.controller";

const getAbsence = requireSameEmployeeIdOrHRDepartmentAccessHandler(
    (req: AuthenticatedRequest, res: NextApiResponse) => employeeAbsenceController.getAbsencesById(req, res)
);

const deleteAbsence = requireHRDepartmentAccessHandler(
    (req: AuthenticatedRequest, res: NextApiResponse) => employeeAbsenceController.deleteAbsence(req, res)
);

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === RequestMethod.GET)    return getAbsence(req, res);
    if (req.method === RequestMethod.DELETE) return deleteAbsence(req, res);
    return methodNotAllowed(res);
}

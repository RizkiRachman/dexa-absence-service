import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {employeeService} from '../services/employee.service';
import {created, ok, okWithPagination} from '@/shared/dtos/response';
import {passwordService} from "@/modules/employee/services/password.service";
import {getPaginationParams, PaginationParams} from "@/shared/dtos/pagination";
import {CreateEmployeeValidation} from "@/modules/employee/validations/employee.validation";
import {SUCCESS_MESSAGES} from "@/shared/utils/constant/responseMessages";

export const employeeController = {

    /**
     * GET /api/employees
     */
    async getEmployeesDetails(req: AuthenticatedRequest, res: NextApiResponse) {
        const filters = getPaginationParams(req.query) as PaginationParams;
        const profiles = await employeeService.getEmployeesProfiles(filters);
        return okWithPagination(res, profiles);
    },

    /**
     * POST /api/employees
     */
    async createEmployee(req: AuthenticatedRequest, res: NextApiResponse) {
        CreateEmployeeValidation.validateOrThrow(req.body);
        const createdBy = req.user.employee_id
        const employee = await employeeService.createEmployee(createdBy, req.body);
        return created(res, employee);
    },

    /**
     * PUT /api/employee/:employeeId/password
     */
    async changePassword(req: AuthenticatedRequest, res: NextApiResponse) {
        const {oldPassword, newPassword} = req.body;
        await passwordService.changePassword(req.user.user_id, oldPassword, newPassword);
        return ok(res, {message: SUCCESS_MESSAGES.CHANGE_PASSWORD_SUCCESS});
    },

    /**
     * GET /api/employees/search/user-id/:userId
     */
    async getEmployeeByUserId(req: AuthenticatedRequest, res: NextApiResponse) {
        const {userId} = req.query as { userId: string };
        const employee = await employeeService.getEmployeeByUserId(userId)
        ok(res, employee);
    },

    /**
     * DELETE /api/employees/:employeeId  (Support only Role HR)
     */
    async deleteEmployee(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId} = req.query as { employeeId: string };
        await employeeService.deleteEmployee(employeeId);
        return ok(res, {message: SUCCESS_MESSAGES.DELETE_SUCCESS});
    },
};

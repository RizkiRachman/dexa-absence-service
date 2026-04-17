import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {employeeService} from '../services/employee.service';
import {ok} from '@/shared/dtos/response';
import {profileService} from "@/modules/employee/services/profile.service";
import {
    throwsIfNonSameEmployeeAndNonHRDepartmentOperation,
    throwsIfNotSameEmployee
} from "@/shared/middleware/employee-access.middleware";

export const employeeProfileController = {

    /**
     * GET /api/employees/:employeeId
     */
    async getProfile(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId} = req.query as { employeeId: string };

        // safety check, optional validation already cover in pages
        throwsIfNonSameEmployeeAndNonHRDepartmentOperation(req.user, employeeId);

        const profile = await employeeService.getProfile(employeeId);
        return ok(res, profile);
    },

    /**
     * PUT /api/employees/:employeeId
     * Body: { phoneNumber, profilePic }
     */
    async updateProfile(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId} = req.query as { employeeId: string };

        // safety check, additional check only same employee id are eligible to update
        throwsIfNotSameEmployee(req.user, employeeId);
        const {phoneNumber, profilePic} = req.body;
        const response = await profileService.updateProfile(employeeId, {
            phoneNumber,
            profilePic: profilePic,
        });
        return ok(res, response);
    },
};

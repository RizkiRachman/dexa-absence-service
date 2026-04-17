import {NextApiResponse} from 'next';
import {AuthenticatedRequest} from '@/shared/dtos/dto';
import {created, ok} from '@/shared/dtos/response';
import {absencesService} from "@/modules/employee/services/absences.service";
import {
    throwsIfNonSameEmployeeAndNonHRDepartmentOperation,
    throwsIfNotSameEmployee
} from "@/shared/middleware/employee-access.middleware";
import {TapInOutValidation, LeaveValidation} from "@/modules/employee/validations/absence.validation";

export const employeeAbsenceController = {

    /**
     * GET /api/employees/:employeeId/absence
     * Query params (optional): ?startDate=2024-02-01&endDate=2024-02-28
     */
    async getAbsences(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId, startDate, endDate} = req.query as Record<string, string>;

        const absences = await absencesService.getAbsencesByEmployeeIdAndFilters(employeeId, {
            startDate,
            endDate,
        });
        return ok(res, absences);
    },
    /**
     * DELETE /api/employees/:employeeId/absences/:absenceId  (HR only)
     */
    async deleteAbsence(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId, absenceId} = req.query as { employeeId: string; absenceId: string };
        await absencesService.deleteAbsence(employeeId, absenceId);
        return ok(res, {message: 'Absence deleted successfully'});
    },

    /**
     * DELETE /api/employees/:employeeId/leave-requests/:leaveRequestId  (HR only)
     */
    async deleteLeaveRequest(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId, leaveRequestId} = req.query as { employeeId: string; leaveRequestId: string };
        await absencesService.deleteLeaveRequest(employeeId, leaveRequestId);
        return ok(res, {message: 'Leave request deleted successfully'});
    },

    /**
     * GET /api/employees/:employeeId/absences/:absenceId
     */
    async getAbsencesById(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId} = req.query as { employeeId: string };
        const {absenceId} = req.query as { absenceId: string };

        // safety check
        throwsIfNonSameEmployeeAndNonHRDepartmentOperation(req.user, employeeId);

        const absences = await absencesService.getAbsencesByEmployeeIdAndAbsenceId(employeeId, absenceId);
        return ok(res, absences);
    },


    /**
     * POST /api/employee/:employeeId/absence
     */
    async createOrUpdate(req: AuthenticatedRequest, res: NextApiResponse) {
        const {employeeId} = req.query as { employeeId: string };

        // safety check
        throwsIfNotSameEmployee(req.user, employeeId);

        const body = req.body;
        if (body.type) {
            // leave request
            LeaveValidation.validateOrThrow(body);
            const absences = await absencesService.createLeave(employeeId, body);
            return created(res, absences);
        }

        // tap in/out
        TapInOutValidation.validateOrThrow(body);
        const absence = await absencesService.createOrUpdateTapInOut(employeeId, body);
        return created(res, absence);
    },
};

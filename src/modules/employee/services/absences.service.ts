import {employeeService} from "@/modules/employee/services/employee.service";
import {getFirstDayOfMonth, getLastDayOfMonth} from "@/shared/utils/helper";
import {
    AbsenceResponse,
    buildAbsenceResponse,
    buildErrorAbsenceDailyAttendanceResponse,
    buildLeaveAbsenceData,
    buildLeaveRequestCreateData,
    buildTapInOutCreateData,
    buildTapInOutUpdateData,
    LeaveCreateRequest,
    TapInOutCreateRequest,
    TapInOutUpdateRequest
} from "@/modules/employee/dtos/absences.dto";
import {absenceRepository, leaveRequestRepository} from "@/modules/employee/repositories/absence.repository";
import {BadRequestError} from "@/shared/errors/exception";
import {ObjectValidation} from "@/shared/utils/validation/objectValidation";
import {ERROR_MESSAGES} from "@/shared/utils/constant/responseMessages";
import {ActivityLogRequest} from "@/modules/activity-log/dtos/activity-log.dto";
import {publish} from "@/lib/rabbitmq";
import {ActivityLogAction, ActivityLogType, QueueConfig} from "@/shared/constants/activity-log";


export const absencesService = {

    // get employee absences by employee id and filters
    async getAbsencesByEmployeeIdAndFilters(employeeId: string, filters: {
        startDate?: string;
        endDate?: string
    }): Promise<AbsenceResponse[]> {
        const employee = await employeeService.getProfile(employeeId);

        const params = {
            startDate: filters.startDate ? new Date(filters.startDate) : getFirstDayOfMonth(),
            endDate: filters.endDate ? new Date(filters.endDate) : getLastDayOfMonth(),
        };

        const absences = await absenceRepository.findAbsences(employee.id, params);
        return absences.map(buildAbsenceResponse);
    },

    // get employee absences by employee id by absence id
    async getAbsencesByEmployeeIdAndAbsenceId(employeeId: string, absenceId: string): Promise<AbsenceResponse> {
        await employeeService.getProfile(employeeId);
        const absence = await absenceRepository.findAbsenceById(absenceId);
        return buildAbsenceResponse(absence);
    },

    // tap in/out
    async createOrUpdateTapInOut(employeeId: string, input: TapInOutCreateRequest): Promise<AbsenceResponse> {
        await employeeService.getProfile(employeeId);
        const date = new Date(input.date);

        const existing = await absenceRepository.findAbsenceByEmployeeIdByDate(employeeId, date);

        if (existing) {
            // update: add check-out time
            const request: TapInOutUpdateRequest = {
                checkOutTime: input.checkOutTime!,
                notes: input.notes,
            };
            const data = buildTapInOutUpdateData(employeeId, request, existing.id);

            // already have check-in and check-out
            if (existing.checkInTime && existing.checkOutTime) {
                throw new BadRequestError(
                    'You have already submitted check in and check out for this date',
                    undefined,
                    buildErrorAbsenceDailyAttendanceResponse(existing));
            }
            if (existing.checkInTime && data.checkOutTime <= existing.checkInTime) {
                throw new BadRequestError(
                    'Check-out time should be after check-in time',
                    undefined,
                    buildErrorAbsenceDailyAttendanceResponse(existing));
            }

            const absence = await absenceRepository.update(data);
            const activityLog = {
                employeeId: employeeId,
                action: ActivityLogAction.CREATE,
                type: ActivityLogType.DAILY_ATTENDANCE,
                dataBefore: existing,
                dataAfter: absence
            } as ActivityLogRequest;

            await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
            return buildAbsenceResponse(absence);
        }

        // create new tap-in/out record
        const data = buildTapInOutCreateData(employeeId, input);

        if (data.checkInTime && data.checkOutTime) {
            throw new BadRequestError('Unable to create tap-in/out record because required to check-in first before check-out');
        }
        if (!data.checkInTime && data.checkOutTime) {
            throw new BadRequestError('Unable to create tap-in/out record because check-in time is required');
        }

        const absence = await absenceRepository.create(data);
        const activityLog = {
            employeeId: employeeId,
            action: ActivityLogAction.CREATE,
            type: ActivityLogType.DAILY_ATTENDANCE,
            dataAfter: absence
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
        return buildAbsenceResponse(absence);
    },

    // delete absence by id
    async deleteAbsence(employeeId: string, absenceId: string): Promise<void> {
        await employeeService.getProfile(employeeId);

        const absence = ObjectValidation.getOrThrowIfNotFound(
            await absenceRepository.findAbsenceById(absenceId),
            ERROR_MESSAGES.EMPLOYEE_ABSENCE_NOT_FOUND
        );
        await absenceRepository.deleteById(absence.id);
        const activityLog = {
            employeeId: employeeId,
            action: ActivityLogAction.DELETE,
            type: ActivityLogType.ABSENCE,
            dataBefore: absence,
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
    },

    // delete leave request by id including pending task and absence data
    async deleteLeaveRequest(employeeId: string, leaveRequestId: string): Promise<void> {
        await employeeService.getProfile(employeeId);
        const leaveRequest = ObjectValidation.getOrThrowIfNotFound(
            await leaveRequestRepository.findById(leaveRequestId),
            ERROR_MESSAGES.LEAVE_REQUEST_NOT_FOUND
        );

        await leaveRequestRepository.deletePendingTaskByLeaveRequestId(leaveRequest.id);
        await absenceRepository.deleteByLeaveRequestId(leaveRequest.id);
        await leaveRequestRepository.deleteByLeaveRequestId(leaveRequest.id);

        const activityLog = {
            employeeId: employeeId,
            action: ActivityLogAction.DELETE,
            type: ActivityLogType.LEAVE_REQUEST,
            dataBefore: leaveRequest,
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
    },

    // leave: create leave request + absence day rows
    async createLeave(employeeId: string, input: LeaveCreateRequest): Promise<AbsenceResponse[]> {
        await employeeService.getProfile(employeeId);
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);

        // check existing leave request
        const isExist = await absenceRepository.isLeaveRequestAlreadyExist(
            employeeId,
            startDate,
            endDate
        );

        console.log('isExist', isExist);
        if (isExist) {
            throw new BadRequestError(
                'You already have an existing leave request with the selected date range'
            );
        }

        const leaveRequestData = buildLeaveRequestCreateData(employeeId, input);

        // validate if leave absence already exist
        ObjectValidation.throwExceptionIfExist(
            await absenceRepository.isLeaveAbsenceAlreadyExistByEmployeeIdByDateRange(employeeId, startDate, endDate),
            new BadRequestError(ERROR_MESSAGES.LEAVE_REQUEST_ALREADY_EXIST)
        );

        // create the leave request
        const leaveRequest = await leaveRequestRepository.create(leaveRequestData);
        const activityLog = {
            employeeId: employeeId,
            action: ActivityLogAction.CREATE,
            type: ActivityLogType.LEAVE_REQUEST,
            dataBefore: leaveRequest,
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)

        // need to improve should be create after hr approval
        // create absence rows for each day in the range
        const absenceData = buildLeaveAbsenceData(
            employeeId,
            leaveRequest.id,
            leaveRequest.startDate,
            leaveRequest.endDate,
            input.notes
        );
        await absenceRepository.createMany(absenceData);

        // return the created absences with leave request info
        const absences = await absenceRepository.findAbsenceByLeaveRequestId(leaveRequest.id);
        return absences.map(buildAbsenceResponse);
    },
};

import {employeeRepository} from '../repositories/employee.repository';
import {UpdateProfileRequest} from '../dtos/profiles.dto';
import {publish, QUEUES} from '@/lib/rabbitmq';
import {UpdateProfileValidation} from "../validations/profiles.validation";
import {ValidationError} from "@/shared/errors/exception";
import {employeeService} from "@/modules/employee/services/employee.service";
import {cache} from "@/lib/cache";
import {ActivityLogRequest} from "@/modules/activity-log/dtos/activity-log.dto";
import {ActivityLogAction, ActivityLogType, QueueConfig} from "@/shared/constants/activity-log";

export const profileService = {

    // update profile by employee id
    async updateProfile(employeeId: string, request: UpdateProfileRequest) {
        // validate input
        console.log("Update profile by employee id : " + employeeId);
        UpdateProfileValidation.validateOrThrow(request);

        // need to check if user is eligible to update profile
        const employee = await employeeService.getProfile(employeeId);
        const user = await employeeService.getUser(employee.userId);

        if (!user.isActive && employee.isDeleted) {
            throw new ValidationError([{
                field: 'isDeleted | isActive',
                message: 'unable to update due to user is not active or employee is deleted'
            }]);
        }

        await employeeRepository.updateProfile(employee.id, request);

        await publish(QUEUES.EMPLOYEE_INFO_UPDATED, {
            employeeId: employee.id,
            updatedFields: Object.keys(request),
        });

        console.log("Refresh cache for employee id : " + employeeId);
        cache.delete(`employee:profile:${employeeId}`);

        const after = await employeeService.getProfile(employeeId)

        const activityLog = {
            employeeId: employeeId,
            action: ActivityLogAction.UPDATE,
            type: ActivityLogType.EMPLOYEES,
            dataBefore: employee,
            dataAfter: after
        } as ActivityLogRequest;
        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)

        return await employeeService.getProfile(employeeId);
    },
};

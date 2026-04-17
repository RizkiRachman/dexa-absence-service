import bcrypt from 'bcryptjs';
import {employeeRepository} from '../repositories/employee.repository';
import {InvalidCredentialsError} from "@/shared/errors/exception";
import {ERROR_MESSAGES} from "@/shared/utils/constant/responseMessages";
import {employeeService} from "@/modules/employee/services/employee.service";
import {ObjectValidation} from "@/shared/utils/validation/objectValidation";
import {PasswordValidation} from "@/modules/employee/validations/password.validation";
import {ActivityLogAction, ActivityLogType, QueueConfig} from "@/shared/constants/activity-log";
import {ActivityLogRequest} from "@/modules/activity-log/dtos/activity-log.dto";
import {publish} from "@/lib/rabbitmq";

export const passwordService = {

    // Change user employee password
    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        ObjectValidation.throwsIfArraysIsNotEmpty(
            PasswordValidation.validateChangePassword(currentPassword, newPassword)
        );

        const user = await employeeService.getUser(userId);
        const employee = await employeeService.getEmployeeByUserId(userId);

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) throw new InvalidCredentialsError(ERROR_MESSAGES.USER_PASSWORD_INCORRECT)

        const hash = await bcrypt.hash(newPassword, 10);

        const activityLog = {
            employeeId: employee.id,
            action: ActivityLogAction.UPDATE,
            type: ActivityLogType.PASSWORD,
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
        await employeeRepository.updatePassword(userId, hash);
    },
};

import {employeeRepository} from '../repositories/employee.repository';
import {ERROR_MESSAGES} from "@/shared/utils/constant/responseMessages";
import {ObjectValidation} from "@/shared/utils/validation/objectValidation";
import {BadRequestError, ConflictError} from "@/shared/errors/exception";
import {authRepository} from "@/modules/auth/repositories/auth.repository";
import {buildPaginatedResult, PaginatedResult, PaginationParams} from "@/shared/dtos/pagination";
import {cache} from "@/lib/cache";
import {Employee, User} from "@prisma/client";
import bcrypt from 'bcryptjs';
import {
    buildCreateEmployeeData,
    buildEmployeeResponse,
    CreateEmployeeRequest,
    EmployeeResponse
} from "@/modules/employee/dtos/profiles.dto";
import {DEFAULT} from "@/shared/utils/constant/default";
import {ActivityLogAction, ActivityLogType, QueueConfig} from "@/shared/constants/activity-log";
import {ActivityLogRequest} from "@/modules/activity-log/dtos/activity-log.dto";
import {publish} from "@/lib/rabbitmq";

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || DEFAULT.DEFAULT_PASSWORD;

export const employeeService = {

    // get employees profile
    async getEmployeesProfiles(params: PaginationParams): Promise<PaginatedResult<any>> {
        const [data, count] = await Promise.all(
            [
                employeeRepository.findAll(params),
                employeeRepository.count()
            ]
        );
        return buildPaginatedResult(data, count, params.page, params.limit);
    },

    // get profile by employee id
    async getProfile(employeeId: string) {
        const cacheKey = DEFAULT.CACHE_EMPLOYEE_PROFILE_KEY_PREFIX.concat(employeeId);
        const cached = cache.get(cacheKey);
        if (cached) return cached as Employee;

        const profile = ObjectValidation.getOrThrowIfNotFound(
            await employeeRepository.findById(employeeId),
            ERROR_MESSAGES.EMPLOYEE_NOT_FOUND
        );

        cache.set(cacheKey, profile, DEFAULT.CACHE_TTL);
        return profile;
    },

    // get user by user id
    async getUser(userId: string) {
        return ObjectValidation.getOrThrowIfNotFound(
            await authRepository.findById(userId),
            ERROR_MESSAGES.USER_NOT_FOUND
        );
    },

    // get employee by user id
    async getEmployeeByUserId(userId: string) {
        return buildEmployeeResponse(ObjectValidation.getOrThrowIfNotFound(
                await employeeRepository.findByUserId(userId),
                ERROR_MESSAGES.EMPLOYEE_NOT_FOUND
            )
        );
    },

    // create employee and user
    async createEmployee(employeeId: string, input: CreateEmployeeRequest): Promise<EmployeeResponse> {
        const defaultPassword = await bcrypt.hash(DEFAULT_PASSWORD, DEFAULT.DEFAULT_PASSWORD_SALT);
        const data = buildCreateEmployeeData(input, defaultPassword);

        ObjectValidation.throwExceptionIfExist(
            await authRepository.findByEmail(data.user.email),
            new ConflictError(ERROR_MESSAGES.USERNAME_IS_ALREADY_EXIST)
        )

        const user = await employeeRepository.createUser(data) as User;
        const employee = await employeeRepository.createEmployee(user.id, data) as Employee;
        const activityLog = {
            employeeId: employeeId,
            action: ActivityLogAction.CREATE,
            type: ActivityLogType.EMPLOYEES,
            dataAfter: employee,
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
        return buildEmployeeResponse(employee);
    },

    // soft-delete employee — sets isDeleted + deactivates user account
    async deleteEmployee(employeeId: string): Promise<void> {
        const employee = ObjectValidation.getOrThrowIfNotFound(
            await employeeRepository.findById(employeeId),
            ERROR_MESSAGES.EMPLOYEE_NOT_FOUND
        );
        if (employee.isDeleted) {
            throw new BadRequestError(ERROR_MESSAGES.EMPLOYEE_ALREADY_DELETED);
        }

        cache.delete(DEFAULT.CACHE_EMPLOYEE_PROFILE_KEY_PREFIX.concat(employeeId));
        await employeeRepository.softDeleteEmployee(employeeId);
        await employeeRepository.softDeleteUser(employee.userId);

        const activityLog = {
            employeeId: employee.id,
            action: ActivityLogAction.DELETE,
            type: ActivityLogType.EMPLOYEES,
            dataBefore: employee,
        } as ActivityLogRequest;

        await publish(QueueConfig.QUEUE_ACTIVITY_LOG, activityLog)
    },
};

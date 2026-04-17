import {NextApiResponse} from 'next';
import {AuthenticatedRequest, AuthHandler} from '@/shared/dtos/dto';
import {withAuth} from './auth.middleware';
import {ForbiddenError} from "@/shared/errors/exception";
import {ERROR_MESSAGES} from "@/shared/utils/constant/responseMessages";
import {Role} from "@/shared/constants/roles";
import {JwtPayload} from "jsonwebtoken";

export function requireSameEmployeeIdAccessHandler(handler: AuthHandler) {
    return withAuth(
        async (req: AuthenticatedRequest, res: NextApiResponse) => {
            const {employeeId} = req.query as { employeeId: string };
            throwsIfNotSameEmployee(req.user, employeeId);
            return handler(req, res);
        }
    );
}

export function requireSameEmployeeIdOrHRDepartmentAccessHandler(handler: AuthHandler) {
    return withAuth(
        async (req: AuthenticatedRequest, res: NextApiResponse) => {
            const {employeeId} = req.query as { employeeId: string };
            throwsIfNonSameEmployeeAndNonHRDepartment(req.user, employeeId);
            return handler(req, res);
        }
    );
}

export function requireHRDepartmentAccessHandler(handler: AuthHandler) {
    return withAuth(
        async (req: AuthenticatedRequest, res: NextApiResponse) => {
            throwsIfNonHRDepartment(req.user);
            return handler(req, res);
        }
    )
}

export function throwsIfNonSameEmployeeAndNonHRDepartmentOperation(token: JwtPayload, employeeId: string) {
    if (!validateHRDepartment(token.role) && !validateEmployeeId(token.employee_id, employeeId)) {
        console.error(`Operation - Unauthorized access attempt: user ${token.user_id} with role ${token.role} trying to access employee ${employeeId}'s data`);
        throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED);
    }
}

export function throwsIfNotSameEmployee(token: JwtPayload, employeeId: string) {
    if (!validateEmployeeId(token.employee_id, employeeId)) {
        throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED);
    }
}

export function throwsIfNonHRDepartment(token: JwtPayload) {
    if (!validateHRDepartment(token.role)) {
        throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED);
    }
}

function throwsIfNonSameEmployeeAndNonHRDepartment(token: JwtPayload, request: string) {
    if (!validateEmployeeId(token.employee_id, request) && !validateHRDepartment(token.role)) {
        throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED);
    }
}

function validateHRDepartment(role: string): boolean {
    return role === Role.HR;
}

function validateEmployeeId(current: string, request: string): boolean {
    return current === request;
}

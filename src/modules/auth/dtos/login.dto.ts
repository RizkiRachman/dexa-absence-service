import {Employee, User} from "@prisma/client";

export interface LoginRequest {
    email: string;
    password: string;
}

export function buildLoginResponse(
    token: string,
    user: User,
    employee: Employee
): LoginResponse {
    return {
        token,
        user: buildUserResponse(user, employee),
    };
}

export function buildUserResponse(user: User, employee: Employee) {
    return {
        id: user.id,
        employeeId: employee.id,
        email: user.email,
        role: user.role,
    }
}

export interface UserResponse {
    id: string;
    employeeId: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
}

export interface UserResponse {
    id: string;
    employeeId: string;
    email: string;
    role: string;
}
import {Department} from "@prisma/client";

export interface UpdateProfileInput {
    phoneNumber?: string;
    profilePic?: string;
}

export interface CreateEmployeeRequest {
    username: string;
    email: string;
    displayName: string;
    profilePic?: string;
    position: string;
    departmentId: Department;
}

export interface CreateEmployeeData {
    user: {
        email: string;
        passwordHash: string;
        role: 'employee';
    };
    employee: {
        name: string;
        displayName: string;
        email: string;
        profilePic?: string;
        position: string;
        departmentId: Department;
        phoneNumber: string;
    };
}

export interface EmployeeResponse {
    id: string;
    userId: string;
    name: string;
    displayName: string;
    email: string;
    profilePic: string | null;
    position: string;
    departmentId: Department;
    phoneNumber: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export function buildCreateEmployeeData(input: CreateEmployeeRequest, passwordHash: string): CreateEmployeeData {
    return {
        user: {
            email: input.email,
            passwordHash,
            role: 'employee',
        },
        employee: {
            name: input.username,
            displayName: input.displayName,
            email: input.email,
            ...(input.profilePic && {profilePic: input.profilePic}),
            position: input.position,
            departmentId: input.departmentId,
            phoneNumber: '',
        },
    };
}

export function buildEmployeeResponse(employee: any): EmployeeResponse {
    return {
        id: employee.id,
        userId: employee.userId,
        name: employee.name,
        displayName: employee.displayName,
        email: employee.email,
        profilePic: employee.profilePic ?? null,
        position: employee.position,
        departmentId: employee.departmentId,
        phoneNumber: employee.phoneNumber,
        isDeleted: employee.isDeleted,
        createdAt: employee.createdAt ? new Date(employee.createdAt).toISOString() : '',
        updatedAt: employee.updatedAt ? new Date(employee.updatedAt).toISOString() : '',
    };
}
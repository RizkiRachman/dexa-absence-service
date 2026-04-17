import {ErrorDetail} from '@/shared/dtos/dto';
import {ObjectValidation} from '@/shared/utils/validation/objectValidation';
import {CreateEmployeeRequest} from "@/modules/employee/dtos/profiles.dto";
import {Department} from "@prisma/client";

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class CreateEmployeeValidation {
    private readonly input: CreateEmployeeRequest;

    constructor(input: CreateEmployeeRequest) {
        this.input = input;
    }

    validate(): ErrorDetail[] {
        const errors: ErrorDetail[] = [];

        if (!this.input.username) {
            errors.push({field: 'username', message: 'Username is required'});
        }

        if (!this.input.email) {
            errors.push({field: 'email', message: 'Email is required'});
        } else if (!isValidEmail(this.input.email)) {
            errors.push({field: 'email', message: 'Invalid email format'});
        }

        if (!this.input.displayName) {
            errors.push({field: 'displayName', message: 'Display name is required'});
        }

        if (!this.input.position) {
            errors.push({field: 'position', message: 'Position is required'});
        }

        if (!this.input.departmentId) {
            errors.push({field: 'departmentId', message: 'Department is required'});
        } else if (!Object.values(Department).includes(this.input.departmentId)) {
            errors.push({field: 'departmentId', message: `Invalid department, must be one of: ${Object.values(Department).join(', ')}`});
        }

        return errors;
    }

    static validateOrThrow(input: CreateEmployeeRequest): void {
        ObjectValidation.throwsIfArraysIsNotEmpty(new CreateEmployeeValidation(input).validate());
    }
}

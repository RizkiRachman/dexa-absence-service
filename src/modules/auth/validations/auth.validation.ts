import {ErrorDetail} from '@/shared/dtos/dto';
import {ObjectValidation} from '@/shared/utils/validation/objectValidation';
import {EmailValidation} from "@/modules/employee/validations/email.validation";
import {PasswordValidation} from "@/modules/employee/validations/password.validation";
import {LoginRequest} from "@/modules/auth/dtos/login.dto";

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'password';

export class AuthValidation {
    private readonly request: LoginRequest;

    constructor(request: LoginRequest) {
        this.request = request;
    }

    private isDefaultPassword(): boolean {
        return this.request.password === DEFAULT_PASSWORD;
    }

    validate(): ErrorDetail[] {
        const errors: ErrorDetail[] = [];
        const emailError = EmailValidation.validate(this.request.email);
        if (emailError) errors.push(emailError);

        console.log("Password: "+this.request.password);
        const passwordError = PasswordValidation.validate(this.request.password);
        if (passwordError) errors.push(passwordError);

        if (this.isDefaultPassword()) {
            //errors.push({field: FIELD.PASSWORD, message: ERROR_MESSAGES.DEFAULT_PASSWORD});
        }
        return errors;
    }

    static validateOrThrow(request: LoginRequest): void {
        ObjectValidation.throwsIfArraysIsNotEmpty(new AuthValidation(request).validate());
    }
}
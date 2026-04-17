import {ErrorDetail} from '@/shared/dtos/dto';
import {ObjectValidation} from '@/shared/utils/validation/objectValidation';
import {EmailValidation} from "@/modules/employee/validations/email.validation";
import {PasswordValidation} from "@/modules/employee/validations/password.validation";
import {LoginRequest} from "@/modules/auth/dtos/login.dto";
import {FIELD} from "@/shared/utils/constant/common";

export class AuthValidation {
    private readonly request: LoginRequest;

    constructor(request: LoginRequest) {
        this.request = request;
    }

    validate(): ErrorDetail[] {
        const errors: ErrorDetail[] = [];
        const emailError = EmailValidation.validate(this.request.email, FIELD.USERNAME);
        if (emailError) errors.push(emailError);

        const passwordError = PasswordValidation.validate(this.request.password, FIELD.PASSWORD);
        if (passwordError) errors.push(passwordError);

        return errors;
    }

    static validateOrThrow(request: LoginRequest): void {
        ObjectValidation.throwsIfArraysIsNotEmpty(new AuthValidation(request).validate());
    }
}
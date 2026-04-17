import {ErrorDetail} from '@/shared/dtos/dto';

export class PasswordValidation {
    static readonly MIN_LENGTH = 4;
    static readonly MAX_LENGTH = 72; // bcrypt hard limit
    readonly field: string;
    private readonly password: string;

    constructor(password: string, field = 'password') {
        this.password = password;
        this.field = field;
    }

    static validate(password: string, field = 'password'): ErrorDetail | null {
        return new PasswordValidation(password, field).validate();
    }

    static validateChangePassword(oldPassword: string, newPassword: string): ErrorDetail[] | null {
        const errors: ErrorDetail[] = [];
        console.log("Old password: " + oldPassword);
        console.log("New password: " + newPassword);
        const errorOldPassword = new PasswordValidation(oldPassword, "old password").validate();
        const errorNewPassword = new PasswordValidation(newPassword, "new password").validate();
        if (errorOldPassword) errors.push(errorOldPassword);
        if (errorNewPassword) errors.push(errorNewPassword);
        return errors;
    }

    validate(): ErrorDetail | null {
        if (!this.isNotEmpty()) return {field: this.field, message: 'Password is required'};
        if (!this.isLongEnough()) return {
            field: this.field,
            message: `Password must be at least ${PasswordValidation.MIN_LENGTH} characters`
        };
        if (!this.isMaxLength()) return {
            field: this.field,
            message: `Password must not exceed ${PasswordValidation.MAX_LENGTH} characters`
        };
        return null;
    }

    private isNotEmpty(): boolean {
        return !!this.password && this.password.length > 0;
    }

    private isLongEnough(): boolean {
        return !!this.password && this.password.length >= PasswordValidation.MIN_LENGTH;
    }

    private isMaxLength(): boolean {
        return !!this.password && this.password.length <= PasswordValidation.MAX_LENGTH;
    }
}
